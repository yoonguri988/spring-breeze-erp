package com.sb.erp.pos.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sb.erp.pos.dto.request.PosRequest;
import com.sb.erp.pos.dto.response.PosResponse;
import com.sb.erp.pos.service.PosService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Position REST API", description = "직급 관리 REST API")
@RestController
@RequestMapping("/api/pos")
@CrossOrigin(origins = "*")
public class PosController {

	@Autowired PosService posService;

	@Operation(summary = "직급 목록 조회")
	@GetMapping
	public ResponseEntity<List<PosResponse>> list() {
		return ResponseEntity.ok(posService.selectAll());
	}

	@Operation(summary = "직급 상세 조회")
	@GetMapping("/{posId}")
	public ResponseEntity<PosResponse> detail(@PathVariable long posId) {
		PosResponse pos = posService.selectOneById(posId);
		if (pos == null) return ResponseEntity.notFound().build();
		return ResponseEntity.ok(pos);
	}

	@Operation(summary = "직급 등록")
	@PostMapping
	public ResponseEntity<?> add(@RequestBody PosRequest request) {
		int result = posService.insert(request);
		if (result > 0) {
			PosResponse saved = posService.selectOneById(request.getPosId());
			return ResponseEntity.status(HttpStatus.CREATED).body(saved);
		}
		return ResponseEntity.badRequest()
				.body(Map.of("message", "등록에 실패했습니다."));
	}

	@Operation(summary = "직급 수정")
	@PutMapping("/{posId}")
	public ResponseEntity<?> edit(@PathVariable long posId,
			@RequestBody PosRequest request) {
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
	public ResponseEntity<Map<String, String>> delete(@PathVariable long posId) {
		int result = posService.delete(posId);
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
			@RequestParam String posCode,
			@RequestParam(required = false) Long excludePosId) {
		return ResponseEntity.ok(
				Map.of("duplicate", posService.isPosCodeDuplicate(posCode, excludePosId)));
	}
}
