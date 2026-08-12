package com.sb.erp.perm.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sb.erp.perm.dto.request.EmpAuthRequest;
import com.sb.erp.perm.dto.request.PermRequest;
import com.sb.erp.perm.dto.response.EmpAuthResponse;
import com.sb.erp.perm.dto.response.PermResponse;
import com.sb.erp.perm.service.PermService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/perm")
@RequiredArgsConstructor
@Tag(name = "권한 관리", description = "권한 CRUD, 사원-권한 부여/회수 API")
public class PermController {

	private final PermService permService;


	// ═══════════════════════════════════════════
	// 권한 CRUD
	// ═══════════════════════════════════════════

	@Operation(summary = "권한 목록 조회", description = "권한별 부여 사원 수 포함")
	@GetMapping
	public ResponseEntity<List<PermResponse>> list() {
		return ResponseEntity.ok(permService.selectAll());
	}


	@Operation(summary = "권한 상세 조회", description = "권한 정보 + 부여된 사원 목록")
	@GetMapping("/{autId}")
	public ResponseEntity<?> detail(@PathVariable("autId") long autId) {
		PermResponse role = permService.selectOneById(autId);
		if (role == null) return ResponseEntity.notFound().build();

		List<EmpAuthResponse> employees = permService.selectEmpsByAuthId(autId);

		return ResponseEntity.ok(Map.of(
				"role", role,
				"employees", employees
		));
	}


	@Operation(summary = "권한 등록")
	@PostMapping
	public ResponseEntity<?> add(@jakarta.validation.Valid @RequestBody PermRequest request) {
		int result = permService.insert(request);
		if (result > 0) {
			// insert 후 재조회 → PK + autCount 등 완전한 데이터 반환
			PermResponse saved = permService.selectOneById(request.getAutId());
			return ResponseEntity.status(HttpStatus.CREATED).body(saved);
		}
		return ResponseEntity.badRequest()
				.body(Map.of("message", "등록에 실패했습니다."));
	}


	@Operation(summary = "권한 수정")
	@PutMapping("/{autId}")
	public ResponseEntity<?> edit(
			@PathVariable("autId") long autId,
			@jakarta.validation.Valid @RequestBody PermRequest request) {
		request.setAutId(autId);
		int result = permService.update(request);
		if (result > 0) {
			PermResponse updated = permService.selectOneById(autId);
			return ResponseEntity.ok(updated);
		}
		return ResponseEntity.notFound().build();
	}


	@Operation(summary = "권한 삭제")
	@DeleteMapping("/{autId}")
	public ResponseEntity<Map<String, String>> delete(@PathVariable("autId") long autId) {
		int result = permService.delete(autId);
		if (result > 0) return ResponseEntity.ok(Map.of("message", "삭제되었습니다."));
		return ResponseEntity.notFound().build();
	}


	// ═══════════════════════════════════════════
	// 사원-권한 매핑
	// ═══════════════════════════════════════════

	@Operation(summary = "사원의 권한 목록 조회")
	@GetMapping("/emp/{empId}")
	public ResponseEntity<Map<String, Object>> empAuthList(@PathVariable("empId") long empId) {
		List<EmpAuthResponse> authorities = permService.selectAuthsByEmpId(empId);

		return ResponseEntity.ok(Map.of(
				"empId", empId,
				"authorities", authorities
		));
	}


	@Operation(summary = "사원에게 권한 부여")
	@PostMapping("/grant")
	public ResponseEntity<Map<String, String>> grant(@RequestBody EmpAuthRequest request) {
		int result = permService.grantAuth(request);
		if (result > 0) return ResponseEntity.ok(Map.of("message", "권한이 부여되었습니다."));
		return ResponseEntity.badRequest()
				.body(Map.of("message", "권한 부여에 실패했습니다."));
	}


	@Operation(summary = "사원의 권한 회수")
	@PostMapping("/revoke")
	public ResponseEntity<Map<String, String>> revoke(@RequestBody EmpAuthRequest request) {
		int result = permService.revokeAuth(request);
		if (result > 0) return ResponseEntity.ok(Map.of("message", "권한이 회수되었습니다."));
		return ResponseEntity.badRequest()
				.body(Map.of("message", "권한 회수에 실패했습니다."));
	}
}
