package com.sb.erp.dto;

import lombok.Data;

@Data
public class ApprLineDto {
	private int lineId;
	private int docId;
	private int empId;
	private int linOrder;
	private String linStatus;
	private String linApproved;
}
