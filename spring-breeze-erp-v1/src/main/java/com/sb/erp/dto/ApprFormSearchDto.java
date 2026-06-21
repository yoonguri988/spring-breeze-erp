package com.sb.erp.dto;

import lombok.Data;

@Data
public class ApprFormSearchDto {
	private String keyword; 
	private Integer comId;
	private Boolean forStatus;
	
	// 페이징 기능
	private int page;
	private int pageSize;
}
