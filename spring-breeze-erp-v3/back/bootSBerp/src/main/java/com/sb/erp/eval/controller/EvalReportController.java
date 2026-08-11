package com.sb.erp.eval.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sb.erp.eval.dto.request.ReportSearchRequest;
import com.sb.erp.eval.dto.response.PeriodResponse;
import com.sb.erp.eval.dto.response.ReportResponse;
import com.sb.erp.eval.service.EvalPeriodService;
import com.sb.erp.eval.service.EvalReportService;
import com.sb.erp.util.dto.PagingUtil;
import com.sb.erp.util.dto.SecurityUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/eval-report")
@RequiredArgsConstructor
@Tag(name = "AI 인사평가 리포트", description = "리포트 조회, 생성, 재생성 API")
public class EvalReportController {

	private final EvalReportService evalReportService;
	private final EvalPeriodService evalPeriodService;


	// ─── 회차별 리포트 목록 (검색 + 페이징) ─────────
	@Operation(summary = "회차별 리포트 목록", description = "periodId 필수. 검색, 부서필터, 페이징 지원")
	@GetMapping
	public ResponseEntity<?> list(ReportSearchRequest search) {

		if (search.getPeriodId() == null) {
			return ResponseEntity.badRequest()
					.body(Map.of("message", "periodId는 필수입니다."));
		}

		PeriodResponse period = evalPeriodService.selectByPeriodId(search.getPeriodId());
		if (period == null) return ResponseEntity.notFound().build();

		String status = period.getPeriodStatus();
		if (!"CLOSED".equals(status) && !"REPORTED".equals(status)) {
			return ResponseEntity.badRequest()
					.body(Map.of("message", "마감(CLOSED) 이상 상태의 회차만 리포트를 조회할 수 있습니다."));
		}

		int currentPage = (search.getPage() == null || search.getPage() < 1) ? 1 : search.getPage();
		int total = evalReportService.countByPeriodSearch(search);
		PagingUtil paging = new PagingUtil(total, currentPage, 12, 10);

		search.setPstartno(paging.getPstartno());
		search.setOnepagelist(paging.getOnepagelist());

		List<ReportResponse> reports = evalReportService.searchByPeriod(search);

		return ResponseEntity.ok(Map.of(
				"period", period,
				"reports", reports,
				"reportCount", total,
				"paging", paging
		));
	}


	// ─── 리포트 상세 ─────────────────────────────
	@Operation(summary = "리포트 상세 조회")
	@GetMapping("/{reportId}")
	public ResponseEntity<?> detail(@PathVariable long reportId) {

		ReportResponse report = evalReportService.selectByReportId(reportId);
		if (report == null) return ResponseEntity.notFound().build();

		Long loginEmpId = SecurityUtil.getCurrentEmpId();
		if (report.getEmpId() != loginEmpId && !SecurityUtil.isAdmin()) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "본인 리포트만 조회할 수 있습니다."));
		}

		return ResponseEntity.ok(report);
	}


	// ─── 본인 리포트 이력 ────────────────────────
	@Operation(summary = "본인 리포트 이력")
	@GetMapping("/my")
	public ResponseEntity<List<ReportResponse>> my() {
		return ResponseEntity.ok(evalReportService.selectMyAll());
	}


	// ─── 회차 전체 리포트 생성/재생성 ────────────────
	@Operation(summary = "회차 전체 리포트 생성", description = "AI 배치 생성 시작")
	@PostMapping("/generate")
	public ResponseEntity<Map<String, String>> generate(@RequestParam long periodId) {
		int result = evalPeriodService.reportPeriod(periodId);
		if (result == -1) return ResponseEntity.notFound().build();
		if (result == -2) return ResponseEntity.badRequest()
				.body(Map.of("message", "현재 상태에서는 리포트를 생성/재생성할 수 없습니다."));
		return ResponseEntity.ok(Map.of("message", "리포트 생성을 시작합니다."));
	}


	// ─── 특정 사원 리포트 개별 재생성 ────────────────
	@Operation(summary = "특정 사원 리포트 재생성")
	@PostMapping("/regenerate")
	public ResponseEntity<Map<String, String>> regenerate(
			@RequestParam long periodId,
			@RequestParam long empId) {

		int result = evalReportService.regenerateReport(periodId, empId);
		if (result == 1)  return ResponseEntity.ok(Map.of("message", "리포트를 재생성했습니다."));
		if (result == -1) return ResponseEntity.notFound().build();
		if (result == -2) return ResponseEntity.badRequest().body(Map.of("message", "마감 이상 상태에서만 가능합니다."));
		if (result == -3) return ResponseEntity.badRequest().body(Map.of("message", "제출된 평가가 없습니다."));
		return ResponseEntity.internalServerError().body(Map.of("message", "리포트 생성 중 오류가 발생했습니다."));
	}
}
