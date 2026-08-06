package com.sb.erp.eval.dto.request;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class ReportRequest {
	private long reportId;
	private long periodId;
	private long empId;
	private BigDecimal avgPerformance;
	private BigDecimal avgExpertise;
	private BigDecimal avgTeamwork;
	private BigDecimal avgAttitude;
	private BigDecimal avgGrowth;
	private BigDecimal overallScore;
	private String grade;
	private String aiSummary;
	private BigDecimal sentimentPositive;
	private BigDecimal sentimentNeutral;
	private BigDecimal sentimentNegative;
	private String sentimentLabel;
	private String modelName;
}
