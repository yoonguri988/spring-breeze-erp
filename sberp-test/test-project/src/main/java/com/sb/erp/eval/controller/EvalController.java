package com.sb.erp.eval.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sb.erp.eval.dto.request.EvalRequest;
import com.sb.erp.eval.dto.request.PeriodSearchRequest;
import com.sb.erp.eval.dto.response.EvalResponse;
import com.sb.erp.eval.dto.response.PeriodResponse;
import com.sb.erp.eval.service.EvalPeriodService;
import com.sb.erp.eval.service.EvalService;
import com.sb.erp.util.dto.SecurityUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "평가 REST API", description = "평가 작성 / 제출 / 조회")
@RestController
@RequestMapping("/api/eval")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EvalController {

	private final EvalService evalService;
	private final EvalPeriodService evalPeriodService;


	// ─── 평가 대시보드 데이터 ─────────────────────────
	@Operation(summary = "평가 대시보드",
		description = "periodId 미지정 시 OPEN 회차 목록만 반환. 지정 시 해당 회차의 평가 대상 + 진행률.")
	@GetMapping("/dashboard")
	public ResponseEntity<Map<String, Object>> dashboard(
			@RequestParam(required = false) Long periodId) {

		if (periodId == null) {
			PeriodSearchRequest search = new PeriodSearchRequest();
			search.setPeriodStatus("OPEN");
			List<PeriodResponse> openPeriods = evalPeriodService.search(search);

			return ResponseEntity.ok(Map.of("openPeriods", openPeriods));
		}

		PeriodResponse period = evalPeriodService.selectByPeriodId(periodId);
		if (period == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("message", "존재하지 않는 회차입니다."));
		}

		List<EvalResponse> targets = evalService.selectTargetsByCurrentEvaluator(periodId);
		int submittedCount = evalService.countMySubmitted(periodId);

		Map<String, Object> body = new HashMap<>();
		body.put("period", period);
		body.put("targets", targets);
		body.put("submittedCount", submittedCount);
		body.put("totalCount", targets.size());
		return ResponseEntity.ok(body);
	}


	// ─── 평가 단건 조회 ─────────────────────────────
	@Operation(summary = "평가 상세 조회", description = "평가자 본인 또는 관리자만 조회 가능")
	@GetMapping("/{evalId}")
	public ResponseEntity<?> detail(@PathVariable long evalId) {
		EvalResponse eval = evalService.selectByEvalId(evalId);
		if (eval == null) return ResponseEntity.notFound().build();

		Long loginEmpId = SecurityUtil.getCurrentEmpId();
		if (eval.getEvaluatorId() != loginEmpId && !SecurityUtil.isAdmin()) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "본인이 작성한 평가만 조회할 수 있습니다."));
		}

		return ResponseEntity.ok(eval);
	}


	// ─── 임시 저장 ────────────────────────────────
	@Operation(summary = "평가 임시 저장", description = "일부 점수만 채워도 저장 가능")
	@PostMapping("/draft")
	public ResponseEntity<Map<String, String>> saveDraft(@RequestBody EvalRequest request) {
		int result = evalService.saveDraft(request);
		return buildResultResponse(result, "임시 저장했습니다.");
	}


	// ─── 최종 제출 ────────────────────────────────
	@Operation(summary = "평가 최종 제출", description = "모든 점수 + 코멘트 필수")
	@PostMapping("/submit")
	public ResponseEntity<Map<String, String>> submit(
			@jakarta.validation.Valid @RequestBody EvalRequest request) {
		int result = evalService.submit(request);
		return buildResultResponse(result, "평가를 제출했습니다.");
	}


	// ─── 결과 코드 → HTTP 응답 매핑 ────────────────
	// Service의 int 반환 규약:
	//  1: 성공, -1: 회차 없음, -2: OPEN 아님, -3: 평가자 아님, -4: 필수 누락
	private ResponseEntity<Map<String, String>> buildResultResponse(int result, String successMsg) {
		switch (result) {
			case 1:
				return ResponseEntity.ok(Map.of("message", successMsg));
			case -1:
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(Map.of("message", "존재하지 않는 회차입니다."));
			case -2:
				return ResponseEntity.status(HttpStatus.CONFLICT)
						.body(Map.of("message", "진행 중인 회차만 평가할 수 있습니다."));
			case -3:
				return ResponseEntity.status(HttpStatus.FORBIDDEN)
						.body(Map.of("message", "평가 대상이 잘못되었습니다."));
			case -4:
				return ResponseEntity.badRequest()
						.body(Map.of("message", "제출하려면 모든 점수와 코멘트를 입력해야 합니다."));
			default:
				return ResponseEntity.internalServerError()
						.body(Map.of("message", "처리 중 오류가 발생했습니다."));
		}
	}
}
