package com.sb.erp.dto;

import lombok.Data;

@Data
public class ApprFormDto {
	private int forId;
	private int comId;
	private String forCode;
	private String forTitle;
	private String forContent;
	private Boolean forStatus;
	private String createdAt;
	private String updatedAt;
	
	private String comName;
}