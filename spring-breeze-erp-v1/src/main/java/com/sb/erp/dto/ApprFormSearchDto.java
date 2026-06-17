package com.sb.erp.dto;

import lombok.Data;

@Data
public class ApprFormSearchDto {
	private String keyword; 
	private int comId;
	private Boolean forStatus;
}
