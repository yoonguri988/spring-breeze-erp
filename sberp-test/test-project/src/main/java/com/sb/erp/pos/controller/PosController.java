package com.sb.erp.pos.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sb.erp.pos.dto.request.PosRequest;
import com.sb.erp.pos.dto.response.PosResponse;
import com.sb.erp.pos.service.PosService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "직급 관리", description = "직급 CRUD")
@RestController
@RequestMapping("/api/pos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PosController {

	private final PosService posService;

	@Operation(summary = "직급 목록 조회")
	@GetMapping
	public ResponseEntity<List<PosResponse>> list() {
		return ResponseEntity.ok(posService.selectAll());
	}


	@Operation(summary = "직급 상세 조회")
	@GetMapping("/{posId}")
	public ResponseEntity<PosResponse> detail(@PathVariable("posId") long posId) {
		PosResponse pos = posService.selectOneById(posId);
		// 타 회사 직급도 여기서 null → 404. 존재 여부를 노출하지 않는 효과도 있음
		if (pos == null) return ResponseEntity.notFound().build();
		return ResponseEntity.ok(pos);
	}


	@Operation(summary = "직급 등록")
	@PostMapping
	public ResponseEntity<?> add(@jakarta.validation.Valid @RequestBody PosRequest request) {
		int result = posService.insert(request);
		if (result > 0) {
			// insert 시 selectKey가 request.posId를 채워주므로 그 값으로 재조회
			PosResponse saved = posService.selectOneById(request.getPosId());
			return ResponseEntity.status(HttpStatus.CREATED).body(saved);
		}
		return ResponseEntity.badRequest()
				.body(Map.of("message", "등록에 실패했습니다."));
	}


	@Operation(summary = "직급 수정")
	@PutMapping("/{posId}")
	public ResponseEntity<?> edit(@PathVariable("posId") long posId,
			@jakarta.validation.Valid @RequestBody PosRequest request) {
		// PK는 URL을 신뢰. body의 posId는 덮어씀 (경로와 본문 불일치 방지)
		request.setPosId(posId);
		int result = posService.update(request);
		if (result > 0) {
			PosResponse updated = posService.selectOneById(posId);
			return ResponseEntity.ok(updated);
		}
		return ResponseEntity.notFound().build();
	}


	@Operation(summary = "직급 삭제")
	@DeleteMapping("/{posId}")
	public ResponseEntity<Map<String, String>> delete(@PathVariable("posId") long posId) {
		int result = posService.delete(posId);

		// Service 반환값 → HTTP 상태 매핑
		//   -1: 사용 중인 사원 존재 → 409 CONFLICT (재시도해도 안 되는 상태 충돌)
		//    0: 대상 없음          → 404 NOT FOUND
		//    1: 성공               → 200 OK
		if (result == -1) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body(Map.of("message", "사용 중인 사원이 있어 삭제할 수 없습니다."));
		}
		if (result == 0) return ResponseEntity.notFound().build();
		return ResponseEntity.ok(Map.of("message", "삭제되었습니다."));
	}


	@Operation(summary = "직급코드 중복 확인")
	@GetMapping("/check-code")
	public ResponseEntity<Map<String, Boolean>> checkCode(
			@RequestParam("posCode") String posCode,
			// 수정 화면에서 자기 자신을 중복 대상에서 빼기 위해 전달 (등록 시 생략)
			@RequestParam(name="excludePosId", required = false) Long excludePosId) {
		return ResponseEntity.ok(
				Map.of("duplicate", posService.isPosCodeDuplicate(posCode, excludePosId)));
	}
}
