package com.sb.erp.pos.controller;

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

import com.sb.erp.pos.dto.PosDto;
import com.sb.erp.pos.dto.PosRestDto.PosRequestDto;
import com.sb.erp.pos.dto.PosRestDto.PosResponseDto;
import com.sb.erp.pos.service.PosService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pos")
@RequiredArgsConstructor
@Tag(name = "직급 관리", description = "직급 CRUD, 중복검사 API")
public class PosController {

	private final PosService posService;


	// ─── 전체 목록 ────────────────────────────
	@Operation(summary = "직급 목록 조회")
	@GetMapping
	public ResponseEntity<List<PosResponseDto>> list() {
		List<PosResponseDto> list = posService.selectAll()
				.stream()
				.map(PosResponseDto::new)
				.collect(Collectors.toList());
		return ResponseEntity.ok(list);
	}


	// ─── 단건 조회 ────────────────────────────
	@Operation(summary = "직급 상세 조회")
	@GetMapping("/{posId}")
	public ResponseEntity<PosResponseDto> detail(@PathVariable int posId) {
		PosDto pos = posService.selectOneById(posId);
		if (pos == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(new PosResponseDto(pos));
	}


	// ─── 등록 ─────────────────────────────────
	@Operation(summary = "직급 등록")
	@PostMapping
	public ResponseEntity<?> add(@RequestBody PosRequestDto request) {
		PosDto dto = request.toPosDto();
		int result = posService.insert(dto);
		if (result > 0) {
			// selectKey로 채워진 posId로 재조회 → 완전한 응답 보장
			PosDto saved = posService.selectOneById(dto.getPosId());
			return ResponseEntity.status(HttpStatus.CREATED)
					.body(new PosResponseDto(saved));
		}
		return ResponseEntity.badRequest()
				.body(Map.of("message", "등록에 실패했습니다."));
	}


	// ─── 수정 ─────────────────────────────────
	@Operation(summary = "직급 수정")
	@PutMapping("/{posId}")
	public ResponseEntity<?> edit(
			@PathVariable int posId,
			@RequestBody PosRequestDto request) {
		PosDto dto = request.toPosDto();
		dto.setPosId(posId);
		int result = posService.update(dto);
		if (result > 0) {
			PosDto updated = posService.selectOneById(posId);
			return ResponseEntity.ok(new PosResponseDto(updated));
		}
		return ResponseEntity.notFound().build();
	}


	// ─── 삭제 ─────────────────────────────────
	@Operation(summary = "직급 삭제")
	@DeleteMapping("/{posId}")
	public ResponseEntity<Map<String, String>> delete(@PathVariable int posId) {
		int result = posService.delete(posId);
		if (result == -1) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body(Map.of("message", "이 직급을 사용중인 사원이 있어 삭제할 수 없습니다."));
		}
		if (result == 0) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(Map.of("message", "삭제되었습니다."));
	}


	// ─── 코드 중복 검사 ───────────────────────
	@Operation(summary = "직급 코드 중복 검사")
	@GetMapping("/check-code")
	public ResponseEntity<Map<String, Boolean>> checkCode(
			@RequestParam String posCode,
			@RequestParam(required = false) Integer excludePosId) {
		return ResponseEntity.ok(
				Map.of("duplicate", posService.isPosCodeDuplicate(posCode, excludePosId)));
	}
}
