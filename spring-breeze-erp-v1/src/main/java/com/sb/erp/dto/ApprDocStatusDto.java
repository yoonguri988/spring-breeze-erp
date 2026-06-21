package com.sb.erp.dto;

import lombok.Data;

@Data
public class ApprDocStatusDto {
	private int total;
	private int wait;
	private int approve;
	private int reject;
}
