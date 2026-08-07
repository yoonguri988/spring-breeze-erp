package com.sb.erp.eval.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

import com.sb.erp.eval.dto.EvalPeriodDto;
import com.sb.erp.eval.dto.EvalPeriodSearchDto;
import com.sb.erp.eval.dto.ReportProgressDto;
import com.sb.erp.eval.dto.EvalRestDto.PeriodRequestDto;
import com.sb.erp.eval.dto.EvalRestDto.PeriodResponseDto;
import com.sb.erp.eval.service.EvalPeriodService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/eval-period")
@RequiredArgsConstructor
@Tag(name = "평가 회차", description = "회차 CRUD, 상태 전환, 진행률 조회 API")
public class EvalPeriodController {

	private final EvalPeriodService evalPeriodService;


	// ─── 목록 조회 (필터) ─────────────────────────
	@Operation(summary = "회차 목록 조회")
	@GetMapping
	public ResponseEntity<?> list(EvalPeriodSearchDto search) {
		List<PeriodResponseDto> list = evalPeriodService.search(search)
				.stream()
				.map(PeriodResponseDto::new)
				.collect(Collectors.toList());
		Map<String, Integer> stats = evalPeriodService.countByStatusAll();
		return ResponseEntity.ok(Map.of(
				"periodList", list,
				"stats", stats
		));
	}


	// ─── 상세 조회 ───────────────────────────────
	@Operation(summary = "회차 상세 조회")
	@GetMapping("/{periodId}")
	public ResponseEntity<?> detail(@PathVariable int periodId) {
		EvalPeriodDto period = evalPeriodService.selectByPeriodId(periodId);
		if (period == null) {
			return ResponseEntity.notFound().build();
		}

		int evalCount = evalPeriodService.countEvalsByPeriodId(periodId);
		int reportCount = evalPeriodService.countReportsByPeriodId(periodId);

		return ResponseEntity.ok(Map.of(
				"period", new PeriodResponseDto(period),
				"evalCount", evalCount,
				"reportCount", reportCount
		));
	}


	// ─── 등록 ────────────────────────────────────
	@Operation(summary = "회차 등록")
	@PostMapping
	public ResponseEntity<?> add(@RequestBody PeriodRequestDto request) {

		if (evalPeriodService.isDuplicate(request.getEvalYear(), request.getEvalTerm())) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body(Map.of("message", "이미 등록된 회차입니다."));
		}

		EvalPeriodDto dto = request.toEvalPeriodDto();
		int result = evalPeriodService.insert(dto);
		if (result > 0) {
			return ResponseEntity.status(HttpStatus.CREATED)
					.body(new PeriodResponseDto(dto));
		}
		return ResponseEntity.badRequest()
				.body(Map.of("message", "회차 등록에 실패했습니다."));
	}


	// ─── 수정 ────────────────────────────────────
	@Operation(summary = "회차 수정")
	@PutMapping("/{periodId}")
	public ResponseEntity<?> edit(
			@PathVariable int periodId,
			@RequestBody PeriodRequestDto request) {

		EvalPeriodDto current = evalPeriodService.selectByPeriodId(periodId);
		if (current == null) {
			return ResponseEntity.notFound().build();
		}

		EvalPeriodDto dto = request.toEvalPeriodDto();
		dto.setPeriodId(periodId);
		dto.setEvalYear(current.getEvalYear());
		dto.setEvalTerm(current.getEvalTerm());

		int result = evalPeriodService.update(dto);
		if (result > 0) {
			EvalPeriodDto updated = evalPeriodService.selectByPeriodId(periodId);
			return ResponseEntity.ok(new PeriodResponseDto(updated));
		}
		return ResponseEntity.badRequest()
				.body(Map.of("message", "회차 수정에 실패했습니다."));
	}


	// ─── 상태 전환 ───────────────────────────────
	@Operation(summary = "회차 열기 (READY -> OPEN)")
	@PostMapping("/{periodId}/open")
	public ResponseEntity<Map<String, String>> open(@PathVariable int periodId) {
		int result = evalPeriodService.openPeriod(periodId);
		if (result == -1) return ResponseEntity.notFound().build();
		if (result == -2) return ResponseEntity.badRequest().body(Map.of("message", "READY 상태의 회차만 열 수 있습니다."));
		return ResponseEntity.ok(Map.of("message", "회차를 열었습니다."));
	}

	@Operation(summary = "회차 마감 (OPEN -> CLOSED)")
	@PostMapping("/{periodId}/close")
	public ResponseEntity<Map<String, String>> close(@PathVariable int periodId) {
		int result = evalPeriodService.closePeriod(periodId);
		if (result == -1) return ResponseEntity.notFound().build();
		if (result == -2) return ResponseEntity.badRequest().body(Map.of("message", "OPEN 상태의 회차만 마감할 수 있습니다."));
		if (result == -3) return ResponseEntity.badRequest().body(Map.of("message", "미제출 평가가 있어 마감할 수 없습니다."));
		return ResponseEntity.ok(Map.of("message", "회차를 마감했습니다."));
	}

	@Operation(summary = "AI 분석 시작 (CLOSED -> REPORTING)")
	@PostMapping("/{periodId}/report")
	public ResponseEntity<Map<String, String>> report(@PathVariable int periodId) {
		int result = evalPeriodService.reportPeriod(periodId);
		if (result == -1) return ResponseEntity.notFound().build();
		if (result == -2) return ResponseEntity.badRequest().body(Map.of("message", "현재 상태에서는 AI 분석을 시작할 수 없습니다."));
		return ResponseEntity.ok(Map.of("message", "AI 분석을 시작합니다."));
	}


	// ─── 리포트 진행률 (폴링용) ───────────────────
	@Operation(summary = "리포트 생성 진행률 조회")
	@GetMapping("/{periodId}/status")
	public ResponseEntity<ReportProgressDto> getReportProgress(@PathVariable int periodId) {
		EvalPeriodDto period = evalPeriodService.selectByPeriodId(periodId);
		if (period == null) {
			return ResponseEntity.ok(new ReportProgressDto("NOT_FOUND", 0, 0));
		}

		// Controller → Service → Mapper 레이어 원칙 준수
		int completed = evalPeriodService.countReportsByPeriodId(periodId);
		int total = evalPeriodService.countDistinctTargetsByPeriodId(periodId);

		return ResponseEntity.ok(new ReportProgressDto(period.getPeriodStatus(), completed, total));
	}


	// ─── 중복 확인 ───────────────────────────────
	@Operation(summary = "회차 중복 확인")
	@GetMapping("/check-duplicate")
	public ResponseEntity<Map<String, Boolean>> checkDuplicate(
			@RequestParam int evalYear,
			@RequestParam String evalTerm) {
		return ResponseEntity.ok(
				Map.of("duplicate", evalPeriodService.isDuplicate(evalYear, evalTerm)));
	}
}
