package com.sb.erp.emp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.emp.dto.request.EmpRequest;
import com.sb.erp.emp.dto.request.EmpSearchRequest;
import com.sb.erp.emp.dto.request.PasswordChangeRequest;
import com.sb.erp.emp.dto.response.EmpResponse;
import com.sb.erp.emp.service.EmpService;
import com.sb.erp.eval.dto.response.ReportResponse;
import com.sb.erp.eval.service.EvalReportService;
import com.sb.erp.util.dto.PagingUtil;
import com.sb.erp.util.dto.SecurityUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/emp")
@RequiredArgsConstructor
@Tag(name = "사원 관리", description = "사원 CRUD, 비밀번호, 중복검사 API")
public class EmpController {

	private final EmpService empService;
	private final EvalReportService evalReportService;


	// ─── 목록 조회 (검색 + 페이징) ────────────────────────
	@Operation(summary = "사원 목록 조회", description = "검색 조건과 페이징을 적용한 사원 목록")
	@GetMapping
	public ResponseEntity<Map<String, Object>> list(EmpSearchRequest search) {

		int currentPage = (search.getPage() == null || search.getPage() < 1)
				? 1 : search.getPage();

		int total = empService.selectCnt(search);
		PagingUtil paging = new PagingUtil(total, currentPage);

		search.setPstartno(paging.getPstartno());
		search.setOnepagelist(paging.getOnepagelist());

		List<EmpResponse> list = empService.search(search);

		return ResponseEntity.ok(Map.of(
				"list", list,
				"paging", paging
		));
	}


	// ─── 상세 조회 ────────────────────────────────────
	@Operation(summary = "사원 상세 조회")
	@GetMapping("/{empId}")
	public ResponseEntity<Map<String, Object>> detail(
			@Parameter(description = "사원 ID") @PathVariable long empId) {

		Long loginEmpId = SecurityUtil.getCurrentEmpId();
		boolean isAdmin = SecurityUtil.isAdmin();

		// 본인 또는 관리자만 조회 가능
		if (empId != loginEmpId && !isAdmin) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "접근 권한이 없습니다."));
		}

		EmpResponse emp = empService.selectByEmpId(empId);
		if (emp == null) {
			return ResponseEntity.notFound().build();
		}

		ReportResponse latestReport = evalReportService.selectLatestByEmpId(empId);

		// HashMap 사용: null 허용 + 키 생략 가능
		// Map.of()는 null 값 → NPE, 빈 문자열 → 프론트에서 타입 혼동
		Map<String, Object> result = new HashMap<>();
		result.put("emp", emp);
		result.put("isAdmin", isAdmin);
		result.put("isSelf", empId == loginEmpId);
		if (latestReport != null) {
			result.put("latestReport", latestReport);
		}

		return ResponseEntity.ok(result);
	}


	// ─── 사원 등록 ────────────────────────────────────
	@Operation(summary = "사원 등록")
	@PostMapping
	public ResponseEntity<?> add(@jakarta.validation.Valid @RequestBody EmpRequest request) {

		int result = empService.insert(request);

		if (result > 0) {
			EmpResponse saved = empService.selectByEmpId(request.getEmpId());
			return ResponseEntity.status(HttpStatus.CREATED).body(saved);
		}
		return ResponseEntity.badRequest()
				.body(Map.of("message", "등록에 실패했습니다."));
	}


	// ─── 사원 정보 수정 ───────────────────────────────
	@Operation(summary = "사원 정보 수정")
	@PutMapping("/{empId}")
	public ResponseEntity<?> edit(
			@PathVariable long empId,
			@RequestBody EmpRequest request) {

		Long loginEmpId = SecurityUtil.getCurrentEmpId();
		boolean isAdmin = SecurityUtil.isAdmin();

		if (empId != loginEmpId && !isAdmin) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "수정 권한이 없습니다."));
		}

		request.setEmpId(empId);

		// 일반 사원이 관리자 전용 필드를 변경하지 못하도록 보정
		if (!isAdmin) {
			EmpResponse current = empService.selectByEmpId(empId);
			request.setEmpName(current.getEmpName());
			request.setDeptId(current.getDeptId());
			request.setPosId(current.getPosId());
			request.setEmpStatus(current.getEmpStatus());
		}

		empService.update(request);
		EmpResponse updated = empService.selectByEmpId(empId);
		return ResponseEntity.ok(updated);
	}


	// ─── 비밀번호 변경 (본인) ─────────────────────────
	@Operation(summary = "비밀번호 변경 (본인)")
	@PutMapping("/{empId}/password")
	public ResponseEntity<Map<String, String>> editPassword(
			@PathVariable long empId,
			@RequestBody PasswordChangeRequest request) {

		Long loginEmpId = SecurityUtil.getCurrentEmpId();
		if (empId != loginEmpId) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "본인만 변경할 수 있습니다."));
		}

		// 새 비밀번호 확인 불일치
		if (!request.getNewPass().equals(request.getCheckPass())) {
			return ResponseEntity.badRequest()
					.body(Map.of("message", "새 비밀번호가 일치하지 않습니다."));
		}

		int result = empService.changePassword(empId, request.getCurrentPass(), request.getNewPass());

		if (result == -1) {
			return ResponseEntity.notFound().build();
		}
		if (result == 0) {
			return ResponseEntity.badRequest()
					.body(Map.of("message", "현재 비밀번호가 일치하지 않습니다."));
		}
		return ResponseEntity.ok(Map.of("message", "비밀번호가 변경되었습니다."));
	}


	// ─── 비밀번호 초기화 (관리자) ─────────────────────
	@Operation(summary = "비밀번호 초기화 (관리자)")
	@PutMapping("/{empId}/reset-password")
	public ResponseEntity<Map<String, String>> resetPassword(@PathVariable long empId) {

		if (!SecurityUtil.isAdmin()) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "관리자만 초기화할 수 있습니다."));
		}

		int result = empService.resetPassByEmpNo(empId);
		if (result > 0) {
			return ResponseEntity.ok(Map.of("message", "비밀번호가 사번으로 초기화되었습니다."));
		}
		return ResponseEntity.notFound().build();
	}


	// ─── 중복 검사 ────────────────────────────────────
	@Operation(summary = "이메일 중복 검사")
	@GetMapping("/check-email")
	public ResponseEntity<Map<String, Boolean>> checkEmail(
			@RequestParam String empEmail) {
		return ResponseEntity.ok(
				Map.of("duplicate", empService.isEmailDuplicate(empEmail)));
	}

	@Operation(summary = "연락처 중복 검사")
	@GetMapping("/check-mobile")
	public ResponseEntity<Map<String, Boolean>> checkMobile(
			@RequestParam String empMobile) {
		return ResponseEntity.ok(
				Map.of("duplicate", empService.isMobileDuplicate(empMobile)));
	}

	@Operation(summary = "사번 중복 검사")
	@GetMapping("/check-empno")
	public ResponseEntity<Map<String, Boolean>> checkEmpNo(
			@RequestParam String empNo) {
		return ResponseEntity.ok(
				Map.of("duplicate", empService.isEmpNoDuplicate(empNo)));
	}
}
