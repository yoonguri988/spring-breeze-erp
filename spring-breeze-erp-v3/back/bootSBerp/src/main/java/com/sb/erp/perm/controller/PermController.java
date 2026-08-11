package com.sb.erp.perm.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.auth.service.AuthService;
import com.sb.erp.emp.service.EmpService;
import com.sb.erp.perm.dto.AuthPermDto;
import com.sb.erp.emp.dto.EmpAuthDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/perm")
@RequiredArgsConstructor
@Tag(name = "권한 관리", description = "권한 CRUD, 사원-권한 부여/회수 API")
public class PermController {

	private final AuthService authService;
	private final EmpService empService;


	// ═══════════════════════════════════════════
	// 권한 CRUD
	// ═══════════════════════════════════════════

	@Operation(summary = "권한 목록 조회", description = "권한별 부여 사원 수 포함")
	@GetMapping
	public ResponseEntity<List<PermResponseDto>> list() {
		List<PermResponseDto> list = authService.selectAll()
				.stream()
				.map(PermResponseDto::new)
				.collect(Collectors.toList());
		return ResponseEntity.ok(list);
	}


	@Operation(summary = "권한 상세 조회", description = "권한 정보 + 부여된 사원 목록")
	@GetMapping("/{autId}")
	public ResponseEntity<?> detail(@PathVariable int autId) {
		AuthPermDto role = authService.selectOneById(autId);
		if (role == null) {
			return ResponseEntity.notFound().build();
		}

		List<EmpAuthResponseDto> empList = authService.selectEmpsByAuthId(autId)
				.stream()
				.map(EmpAuthResponseDto::new)
				.collect(Collectors.toList());

		return ResponseEntity.ok(Map.of(
				"role", new PermResponseDto(role),
				"employees", empList
		));
	}


	@Operation(summary = "권한 등록")
	@PostMapping
	public ResponseEntity<?> add(@RequestBody PermRequestDto request) {
		AuthPermDto dto = request.toAuthPermDto();
		int result = authService.insert(dto);
		if (result > 0) {
			// insert 후 재조회 → PK + autCount 등 완전한 데이터 반환
			AuthPermDto saved = authService.selectOneById(dto.getAutId());
			return ResponseEntity.status(HttpStatus.CREATED)
					.body(new PermResponseDto(saved));
		}
		return ResponseEntity.badRequest()
				.body(Map.of("message", "등록에 실패했습니다."));
	}


	@Operation(summary = "권한 수정")
	@PutMapping("/{autId}")
	public ResponseEntity<?> edit(
			@PathVariable int autId,
			@RequestBody PermRequestDto request) {
		AuthPermDto dto = request.toAuthPermDto();
		dto.setAutId(autId);
		int result = authService.update(dto);
		if (result > 0) {
			AuthPermDto updated = authService.selectOneById(autId);
			return ResponseEntity.ok(new PermResponseDto(updated));
		}
		return ResponseEntity.notFound().build();
	}


	@Operation(summary = "권한 삭제")
	@DeleteMapping("/{autId}")
	public ResponseEntity<Map<String, String>> delete(@PathVariable int autId) {
		int result = authService.delete(autId);
		if (result > 0) {
			return ResponseEntity.ok(Map.of("message", "삭제되었습니다."));
		}
		return ResponseEntity.notFound().build();
	}


	// ═══════════════════════════════════════════
	// 사원-권한 매핑
	// ═══════════════════════════════════════════

	@Operation(summary = "사원의 권한 목록 조회")
	@GetMapping("/emp/{empId}")
	public ResponseEntity<?> empAuthList(@PathVariable int empId) {
		List<EmpAuthResponseDto> authList = authService.selectAuthsByEmpId(empId)
				.stream()
				.map(EmpAuthResponseDto::new)
				.collect(Collectors.toList());

		return ResponseEntity.ok(Map.of(
				"empId", empId,
				"authorities", authList
		));
	}


	@Operation(summary = "사원에게 권한 부여")
	@PostMapping("/grant")
	public ResponseEntity<Map<String, String>> grant(@RequestBody EmpAuthRequestDto request) {
		EmpAuthDto dto = request.toEmpAuthDto();
		int result = authService.grantAuth(dto);
		if (result > 0) {
			return ResponseEntity.ok(Map.of("message", "권한이 부여되었습니다."));
		}
		return ResponseEntity.badRequest()
				.body(Map.of("message", "권한 부여에 실패했습니다."));
	}


	@Operation(summary = "사원의 권한 회수")
	@PostMapping("/revoke")
	public ResponseEntity<Map<String, String>> revoke(@RequestBody EmpAuthRequestDto request) {
		EmpAuthDto dto = request.toEmpAuthDto();
		int result = authService.revokeAuth(dto);
		if (result > 0) {
			return ResponseEntity.ok(Map.of("message", "권한이 회수되었습니다."));
		}
		return ResponseEntity.badRequest()
				.body(Map.of("message", "권한 회수에 실패했습니다."));
	}
}
