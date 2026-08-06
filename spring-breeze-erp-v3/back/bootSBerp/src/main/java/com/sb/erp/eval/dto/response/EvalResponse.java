package com.sb.erp.eval.dto.response;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EvalResponse {
	private long evalId;
	private long periodId;
	private String periodTitle;
	private long targetEmpId;
	private String targetEmpName;
	private String targetEmpNo;
	private String targetDeptName;
	private String targetPosName;
	private long evaluatorId;
	private String evaluatorName;
	private Integer scorePerformance;
	private Integer scoreExpertise;
	private Integer scoreTeamwork;
	private Integer scoreAttitude;
	private Integer scoreGrowth;
	private BigDecimal weightedScore;
	private String strengthComment;
	private String improvementComment;
	private String evalStatus;
	private String createdAt;
	private String updatedAt;
}
