package com.sb.erp.dto;

import lombok.Data;

@Data
public class ApprDocDto {
	private int docId;
	private int forId;
	private int empId;
	private int comId;
	private String docTitle;
	private String docContent;
	private String docStatus;
	private String docCreated;
	private String docUpdated;
	
	private String docName;
}