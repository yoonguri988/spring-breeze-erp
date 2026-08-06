package com.sb.erp.eval.dto.response;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReportResponse {
	private long reportId;
	private long periodId;
	private String periodTitle;
	private Integer periodYear;
	private String periodTerm;
	private long empId;
	private String empName;
	private String empNo;
	private String deptName;
	private String posName;
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
	private String generatedAt;
}
