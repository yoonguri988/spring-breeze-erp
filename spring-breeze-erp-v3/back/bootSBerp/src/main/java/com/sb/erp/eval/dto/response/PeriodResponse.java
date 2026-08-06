package com.sb.erp.eval.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PeriodResponse {
	private long periodId;
	private long comId;
	private int evalYear;
	private String evalTerm;
	private String title;
	private String startDate;
	private String endDate;
	private String periodStatus;
	private int evalCount;
	private int targetEmpCount;
	private int reportCount;
	private String createdAt;
}
