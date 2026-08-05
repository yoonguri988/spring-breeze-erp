package com.sb.erp.appr.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApprFormSearchCondition {
	private String keyword;
	private Integer comId;
	private String comName;
	private Boolean forStatus;
	private int page = 1;
}
