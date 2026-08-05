package com.sb.erp.appr.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApprDocSearchCondition {
	// history (결재 했던 문서, 전체) / todo (결재 해야될 문서) 
	private String tab = "history";
	private String keyword;
	private String status;
	private int page = 1;
}
