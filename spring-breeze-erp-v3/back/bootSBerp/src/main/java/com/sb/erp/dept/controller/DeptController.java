package com.sb.erp.dept.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.dept.dto.request.DeptRequest;
import com.sb.erp.dept.dto.request.DeptSearchRequest;
import com.sb.erp.dept.dto.response.DeptDetailResponse;
import com.sb.erp.dept.dto.response.DeptListResponse;
import com.sb.erp.dept.dto.response.DeptResponse;
import com.sb.erp.dept.service.DeptService;
import com.sb.erp.global.oauth2.CustomUserPrincipal;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Department REST API", description = "부서 관리 REST API")
@RestController
@RequestMapping("/api/dept")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DeptController {

	@Autowired
	DeptService service;

	// 부서 목록(조직도) 조회 GET /api/dept?comId=
	// comId 미지정 또는 관리자가 아니면 로그인한 사용자의 소속 회사로 제한 (구버전 /dept/list 로직 이식)
	@Operation(summary = "부서 조직도 조회", description = "회사 ID로 부서 조직도(트리) + 부서 통계를 조회합니다. comId를 생략하거나 ADMIN/ROOT가 아니면 로그인한 사용자의 소속 회사로 제한됩니다.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "조회 성공"),
			@ApiResponse(responseCode = "401", description = "인증되지 않은 요청")
	})
	@GetMapping
	public ResponseEntity<DeptListResponse> list(
			@Parameter(description = "조회할 회사 ID (ADMIN/ROOT 전용, 생략 시 로그인한 사용자의 소속 회사로 제한)", example = "1")
			@RequestParam(value = "comId", required = false) Long comId,
			@Parameter(hidden = true)
			@AuthenticationPrincipal CustomUserPrincipal principal) {

		boolean isAdmin = principal.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.anyMatch(a -> a.equals("ROOT") || a.equals("ROLE_ADMIN"));

		if (!isAdmin || comId == null) {
			comId = principal.getComId();
		}

		DeptListResponse response = DeptListResponse.builder()
				.comId(comId)
				.stats(service.selectStats(comId))
				.items(service.selectOrgTree(comId))
				.build();

		return ResponseEntity.ok(response);
	}

	// 부서 목록(평탄화) 조회 GET /api/dept/flat?comId=
	// 트리 구조가 아니라 depth 정보만 포함된 1차원 리스트 - 셀렉트박스 등에서 사용
	@Operation(summary = "부서 목록 평탄화 조회", description = "조직도를 depth 정보가 포함된 1차원 리스트로 조회합니다. (드롭다운/셀렉트박스용)")
	@ApiResponse(responseCode = "200", description = "조회 성공")
	@GetMapping("/flat")
	public ResponseEntity<List<DeptResponse>> flat(
			@Parameter(description = "조회할 회사 ID", example = "1", required = true)
			@RequestParam("comId") long comId) {

		Object flat = service.flattenOrgTree(comId);
		@SuppressWarnings("unchecked")
		List<DeptResponse> result = (List<DeptResponse>) flat;
		return ResponseEntity.ok(result);
	}

	// 부서 등록 기능 POST /api/dept
	@Operation(summary = "부서 등록", description = "새로운 부서를 등록합니다. 상위부서(parentId) 기준으로 depth/정렬순서가 자동 계산됩니다. ADMIN 또는 ROOT 권한이 필요합니다.")
	@ApiResponses({
			@ApiResponse(responseCode = "201", description = "등록 성공"),
			@ApiResponse(responseCode = "400", description = "유효성 검증 실패 또는 등록 실패"),
			@ApiResponse(responseCode = "403", description = "권한 없음 (ADMIN/ROOT만 가능)")
	})
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('ROOT')")
	@PostMapping
	public ResponseEntity<?> add(
			@io.swagger.v3.oas.annotations.parameters.RequestBody(description = "등록할 부서 정보", required = true)
			@Valid @RequestBody DeptRequest dto) {

		int result = service.insert(dto);
		if (result > 0) {
			return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "부서 등록에 성공하였습니다."));
		}
		return ResponseEntity.badRequest().body(Map.of("message", "부서 등록에 실패하였습니다."));
	}

	// 부서 상세 조회 GET /api/dept/{deptId}
	// 계층 경로(ancestorChain) 함께 반환 - 구버전 상세화면의 breadcrumb 용도
	@Operation(summary = "부서 상세 조회", description = "부서 ID로 부서 정보 + 상위 계층 경로(breadcrumb)를 조회합니다.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "조회 성공"),
			@ApiResponse(responseCode = "404", description = "존재하지 않는 부서 ID")
	})
	@GetMapping("/{deptId}")
	public ResponseEntity<DeptDetailResponse> detail(
			@Parameter(description = "조회할 부서 ID", example = "1", required = true)
			@PathVariable("deptId") long deptId) {

		DeptResponse dept = service.selectOneById(deptId);
		if (dept == null) {
			return ResponseEntity.notFound().build();
		}

		@SuppressWarnings("unchecked")
		List<String> ancestorChain = (List<String>) service.getAncestorChain(deptId);

		DeptDetailResponse response = DeptDetailResponse.builder()
				.dept(dept)
				.ancestorChain(ancestorChain)
				.build();

		return ResponseEntity.ok(response);
	}

	// 내 부서 상세 조회 GET /api/dept/my
	// 세션 attribute 대신 JWT principal의 deptId 사용 (구버전 detail()의 deptId 미지정 분기 대체)
	@Operation(summary = "내 부서 상세 조회", description = "로그인한 사용자가 소속된 부서 정보를 조회합니다.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "조회 성공"),
			@ApiResponse(responseCode = "401", description = "인증되지 않은 요청")
	})
	@GetMapping("/my")
	public ResponseEntity<DeptDetailResponse> myDept(
			@Parameter(hidden = true)
			@AuthenticationPrincipal CustomUserPrincipal principal) {

		long deptId = principal.getDeptId();
		return detail(deptId);
	}

	// 부서 수정 기능 PUT /api/dept/{deptId}
	@Operation(summary = "부서 수정", description = "부서 정보를 수정합니다. 상위부서 변경 시 순환참조(하위 부서로 이동) 여부를 검증합니다. ADMIN 또는 ROOT 권한이 필요합니다.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "수정 성공"),
			@ApiResponse(responseCode = "400", description = "순환참조(하위 부서로 이동 시도) 등 유효성 검증 실패"),
			@ApiResponse(responseCode = "403", description = "권한 없음 (ADMIN/ROOT만 가능)")
	})
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('ROOT')")
	@PutMapping("/{deptId}")
	public ResponseEntity<?> update(
			@Parameter(description = "수정할 부서 ID", example = "1", required = true)
			@PathVariable("deptId") long deptId,
			@io.swagger.v3.oas.annotations.parameters.RequestBody(description = "수정할 부서 정보", required = true)
			@Valid @RequestBody DeptRequest dto) {

		dto.setDeptId(deptId);
		try {
			int result = service.update(dto);
			if (result > 0) {
				return ResponseEntity.ok(Map.of("message", "부서 수정에 성공하였습니다."));
			}
			return ResponseEntity.badRequest().body(Map.of("message", "부서 수정에 실패하였습니다."));
		} catch (IllegalArgumentException e) {
			// 순환참조(하위 부서로 이동 시도) 등 검증 실패
			return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
		}
	}

	// 부서 삭제 기능 DELETE /api/dept/{deptId}
	// 소속 사원이 0명이면 완전 삭제, 있으면 PENDING_DELETE 로 전환(이관 대기) - 구버전 로직 그대로 이식
	@Operation(summary = "부서 삭제", description = "부서를 삭제합니다. 소속 사원이 0명이면 완전 삭제되고, 있으면 삭제 대신 이관 대기 상태로 전환됩니다. ADMIN 또는 ROOT 권한이 필요합니다.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "삭제 성공 또는 이관 대기 전환 성공"),
			@ApiResponse(responseCode = "400", description = "하위 부서 존재 등 삭제 불가 사유"),
			@ApiResponse(responseCode = "403", description = "권한 없음 (ADMIN/ROOT만 가능)")
	})
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('ROOT')")
	@DeleteMapping("/{deptId}")
	public ResponseEntity<?> delete(
			@Parameter(description = "삭제할 부서 ID", example = "1", required = true)
			@PathVariable("deptId") long deptId) {

		long empCount = service.countEmployees(deptId);

		if (empCount == 0) {
			try {
				service.delete(deptId);
				return ResponseEntity.ok(Map.of("message", "부서 삭제에 성공하였습니다."));
			} catch (IllegalStateException e) {
				// 하위 부서 존재 등 삭제 불가 사유
				return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
			}
		}

		service.softDelete(deptId);
		return ResponseEntity.ok(Map.of(
				"message", "사원이 존재해 삭제 대신 이관 대기 상태로 전환되었습니다.",
				"pendingTransfer", true,
				"deptId", deptId));
	}

	// 부서 코드 중복 체크 GET /api/dept/check-deptcode
	@Operation(summary = "부서코드 중복확인", description = "부서 코드 중복 여부를 확인합니다.")
	@ApiResponse(responseCode = "200", description = "확인 성공 (duplicate: true/false)")
	@GetMapping("/check-deptcode")
	public ResponseEntity<Map<String, Object>> checkDeptCode(
			@Parameter(description = "검사할 부서코드/회사ID 등 검색조건")
			@ModelAttribute DeptSearchRequest search) {

		boolean duplicate = service.isDuplicateDeptCode(search) != null;
		return ResponseEntity.ok(Map.of("duplicate", duplicate));
	}

	// 상위 계층 부서 목록 GET /api/dept/{deptId}/ancestors
	// KJY 조직도 범위 제한 - 특정 부서 기준 상위 조상 부서들만 반환 (셀렉트박스 범위 제한용)
	@Operation(summary = "상위 계층 부서 목록", description = "특정 부서 기준 상위 계층(조상) 부서 목록을 조회합니다. (조직도 범위 제한용 셀렉트박스에서 사용)")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "조회 성공"),
			@ApiResponse(responseCode = "404", description = "존재하지 않는 부서 ID")
	})
	@GetMapping("/{deptId}/ancestors")
	public ResponseEntity<List<DeptResponse>> ancestors(
			@Parameter(description = "기준 부서 ID", example = "5", required = true)
			@PathVariable("deptId") long deptId) {

		return ResponseEntity.ok(service.selectAncestorDepts(deptId));
	}
}