package com.sb.erp.eval.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class EvalRequest {
	private long evalId;
	private long periodId;
	private long targetEmpId;
	private long evaluatorId;
	private String evalType;
	private Integer scorePerformance;
	private Integer scoreExpertise;
	private Integer scoreTeamwork;
	private Integer scoreAttitude;
	private Integer scoreGrowth;
	private java.math.BigDecimal weightedScore;
	private String strengthComment;
	private String improvementComment;
	private String evalStatus;
}
