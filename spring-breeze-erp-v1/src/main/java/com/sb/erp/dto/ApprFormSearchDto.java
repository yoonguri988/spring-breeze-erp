package com.sb.erp.dto;

import lombok.Data;

@Data
public class ApprFormSearchDto {
	private String keyword; 
	private Integer comId;
	private Boolean forStatus;
}
