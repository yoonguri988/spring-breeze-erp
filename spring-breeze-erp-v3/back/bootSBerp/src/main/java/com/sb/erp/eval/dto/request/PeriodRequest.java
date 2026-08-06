package com.sb.erp.eval.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class PeriodRequest {
	private long periodId;
	private long comId;
	private int evalYear;
	private String evalTerm;
	private String title;
	private String startDate;
	private String endDate;
	private String periodStatus;
}
