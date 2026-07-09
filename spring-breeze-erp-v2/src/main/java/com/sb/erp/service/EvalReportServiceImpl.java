package com.sb.erp.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.EvalReportMapper;
import com.sb.erp.dto.EvalPeriodDto;
import com.sb.erp.dto.EvalReportDto;
import com.sb.erp.util.SecurityUtil;

@Service
public class EvalReportServiceImpl implements EvalReportService {

	@Autowired EvalReportMapper dao;
	@Autowired EvalPeriodService evalPeriodService;

	// 가중치 (합계 1.00)
	private static final BigDecimal W_PERFORMANCE = new BigDecimal("0.40");
	private static final BigDecimal W_EXPERTISE   = new BigDecimal("0.20");
	private static final BigDecimal W_TEAMWORK    = new BigDecimal("0.20");
	private static final BigDecimal W_ATTITUDE    = new BigDecimal("0.10");
	private static final BigDecimal W_GROWTH      = new BigDecimal("0.10");

	// Mock 리포트 모델 표기 (※OpenAI 연동 시 교체)
	private static final String MOCK_MODEL_NAME = "mock-analyzer-v1";


	// ─── 조회 ─────────────────────────────────────

	@Override
	public List<EvalReportDto> selectByPeriodId(int periodId) {
		return dao.selectByPeriodId(periodId, SecurityUtil.getCurrentComId());
	}

	@Override
	public EvalReportDto selectByReportId(int reportId) {
		return dao.selectByReportId(reportId, SecurityUtil.getCurrentComId());
	}

	@Override
	public int countByPeriodId(int periodId) {
		return dao.countByPeriodId(periodId);
	}

	@Override
	public EvalReportDto selectMyByPeriod(int periodId) {
		return dao.selectByPeriodAndEmp(periodId, SecurityUtil.getCurrentEmpId());
	}

	@Override
	public List<EvalReportDto> selectMyAll() {
		return dao.selectByEmpId(SecurityUtil.getCurrentEmpId());
	}


	// ─── 생성/재생성 ───────────────────────────────
	@Override
	public int generateReports(int periodId) {
		// 회차 소유/존재 확인 (comId 격리 포함)
		EvalPeriodDto period = evalPeriodService.selectByPeriodId(periodId);
		if (period == null) { return -1; }

		// CLOSED 또는 REPORTED만 리포트 생성 가능
		String status = period.getPeriodStatus();
		if (!"CLOSED".equals(status) && !"REPORTED".equals(status)) { return -2; }

		// 회차 내 사원별 평가 집계 조회
		List<Map<String, Object>> aggregates = dao.selectAggregatesByPeriod(periodId);
		if (aggregates == null || aggregates.isEmpty()) { return -3; }

		// 사원별 리포트 생성 (기존 존재 시 update)
		for (Map<String, Object> agg : aggregates) {
			EvalReportDto report = buildReportFromAggregate(periodId, agg);

			// 기존 리포트 존재 여부 확인 (upsert 분기)
			EvalReportDto existing = dao.selectByPeriodAndEmp(periodId, report.getEmpId());
			if (existing == null) {
				dao.insert(report);
			} else {
				dao.update(report);
			}
		}
		return 1;
	}

	@Override
	public int regenerateReport(int periodId, int empId) {
		EvalPeriodDto period = evalPeriodService.selectByPeriodId(periodId);
		if (period == null) { return -1; }

		String status = period.getPeriodStatus();
		if (!"CLOSED".equals(status) && !"REPORTED".equals(status)) { return -2; }

		// 해당 사원의 집계만 찾기 (전체 집계 조회 후 필터링)
		List<Map<String, Object>> aggregates = dao.selectAggregatesByPeriod(periodId);
		for (Map<String, Object> agg : aggregates) {
			int aggEmpId = toInt(agg.get("empId"));
			if (aggEmpId == empId) {
				EvalReportDto report = buildReportFromAggregate(periodId, agg);
				EvalReportDto existing = dao.selectByPeriodAndEmp(periodId, empId);
				if (existing == null) { dao.insert(report); }
				else { dao.update(report); }
				return 1;
			}
		}
		return -3;  // 해당 사원 평가가 없음
	}


	// ─── Mock 리포트 생성 로직 (※OpenAI 연동 전 임시) ───
	private EvalReportDto buildReportFromAggregate(int periodId, Map<String, Object> agg) {
		EvalReportDto dto = new EvalReportDto();
		dto.setPeriodId(periodId);
		dto.setEmpId(toInt(agg.get("empId")));

		BigDecimal avgP = toBigDecimal(agg.get("avgPerformance"));
		BigDecimal avgE = toBigDecimal(agg.get("avgExpertise"));
		BigDecimal avgT = toBigDecimal(agg.get("avgTeamwork"));
		BigDecimal avgA = toBigDecimal(agg.get("avgAttitude"));
		BigDecimal avgG = toBigDecimal(agg.get("avgGrowth"));

		dto.setAvgPerformance(avgP);
		dto.setAvgExpertise(avgE);
		dto.setAvgTeamwork(avgT);
		dto.setAvgAttitude(avgA);
		dto.setAvgGrowth(avgG);

		// 종합 점수 = 가중 평균 (scale 2, HALF_UP)
		BigDecimal overall = avgP.multiply(W_PERFORMANCE)
				.add(avgE.multiply(W_EXPERTISE))
				.add(avgT.multiply(W_TEAMWORK))
				.add(avgA.multiply(W_ATTITUDE))
				.add(avgG.multiply(W_GROWTH))
				.setScale(2, RoundingMode.HALF_UP);
		dto.setOverallScore(overall);
		dto.setGrade(calcGrade(overall));

		// Mock 감성 분석 (종합 점수 기반 규칙)
		BigDecimal[] sentiment = mockSentiment(overall);
		dto.setSentimentPositive(sentiment[0]);
		dto.setSentimentNeutral(sentiment[1]);
		dto.setSentimentNegative(sentiment[2]);
		dto.setSentimentLabel(labelFromSentiment(sentiment));

		// Mock AI 요약 (템플릿 기반)
		String empName = (String) agg.get("empName");
		String strengths = (String) agg.get("allStrengthComments");
		String improvements = (String) agg.get("allImprovementComments");
		int evalCount = toInt(agg.get("evalCount"));
		dto.setAiSummary(mockSummary(empName, overall, dto.getGrade(),
				strengths, improvements, evalCount));

		dto.setModelName(MOCK_MODEL_NAME);
		return dto;
	}

	// 종합 점수 → 등급 매핑
	// S: 4.5+, A: 4.0+, B: 3.5+, C: 3.0+, D: 그 이하
	private String calcGrade(BigDecimal overall) {
		if (overall.compareTo(new BigDecimal("4.5")) >= 0) { return "S"; }
		if (overall.compareTo(new BigDecimal("4.0")) >= 0) { return "A"; }
		if (overall.compareTo(new BigDecimal("3.5")) >= 0) { return "B"; }
		if (overall.compareTo(new BigDecimal("3.0")) >= 0) { return "C"; }
		return "D";
	}

	// 종합 점수 기반 mock 감성 분포 (합계 정확히 1.00, ck_sentiment_sum 통과)
	private BigDecimal[] mockSentiment(BigDecimal overall) {
		double s = overall.doubleValue();
		double pos, neu, neg;
		if (s >= 4.0)      { pos = 0.70; neu = 0.25; neg = 0.05; }
		else if (s >= 3.5) { pos = 0.50; neu = 0.35; neg = 0.15; }
		else if (s >= 3.0) { pos = 0.30; neu = 0.45; neg = 0.25; }
		else if (s >= 2.5) { pos = 0.15; neu = 0.40; neg = 0.45; }
		else               { pos = 0.05; neu = 0.30; neg = 0.65; }

		BigDecimal p = new BigDecimal(pos).setScale(2, RoundingMode.HALF_UP);
		BigDecimal ne = new BigDecimal(neu).setScale(2, RoundingMode.HALF_UP);
		
		// 합계 강제로 1.00 맞추기 (negative = 1 - pos - neu)
		BigDecimal ng = new BigDecimal("1.00").subtract(p).subtract(ne).setScale(2, RoundingMode.HALF_UP);
		return new BigDecimal[] { p, ne, ng };
	}

	private String labelFromSentiment(BigDecimal[] s) {
		BigDecimal p = s[0], ne = s[1], ng = s[2];
		if (p.compareTo(ne) >= 0 && p.compareTo(ng) >= 0) { return "POSITIVE"; }
		if (ng.compareTo(p) > 0 && ng.compareTo(ne) > 0)  { return "NEGATIVE"; }
		return "NEUTRAL";
	}

	// Mock 요약문 (※API 연동 전 템플릿)
	private String mockSummary(String empName, BigDecimal overall, String grade,
			String strengths, String improvements, int evalCount) {

		StringBuilder sb = new StringBuilder();
		sb.append("[Mock 요약] ")
		  .append(empName == null ? "대상 사원" : empName)
		  .append("님은 총 ").append(evalCount).append("건의 평가를 받았으며, ")
		  .append("종합 점수 ").append(overall.toPlainString()).append("점(").append(grade).append(" 등급)을 획득했습니다.\n\n");

		sb.append("■ 주요 강점\n");
		if (strengths != null && !strengths.isBlank()) {
			sb.append(truncate(strengths, 300)).append("\n\n");
		} else {
			sb.append("(수집된 강점 코멘트 없음)\n\n");
		}

		sb.append("■ 개선 제안\n");
		if (improvements != null && !improvements.isBlank()) {
			sb.append(truncate(improvements, 300)).append("\n\n");
		} else {
			sb.append("(수집된 개선 코멘트 없음)\n\n");
		}

		sb.append("※ 본 요약은 OpenAI 연동 전 임시 mock 데이터입니다.");
		return sb.toString();
	}

	private String truncate(String s, int max) {
		if (s == null) { return ""; }
		return s.length() <= max ? s : s.substring(0, max) + "...";
	}

	private int toInt(Object v) {
		if (v == null) { return 0; }
		if (v instanceof Number) { return ((Number) v).intValue(); }
		return Integer.parseInt(v.toString());
	}

	private BigDecimal toBigDecimal(Object v) {
		if (v == null) { return BigDecimal.ZERO; }
		if (v instanceof BigDecimal) { return (BigDecimal) v; }
		if (v instanceof Number)     { return new BigDecimal(v.toString()); }
		return new BigDecimal(v.toString());
	}
}
