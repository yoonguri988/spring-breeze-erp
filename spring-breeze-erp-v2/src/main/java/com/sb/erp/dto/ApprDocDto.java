package com.sb.erp.dto;

import java.util.List;

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
	private String createdAt;
	private String updatedAt;
	private boolean isImportant;
	
	private String docName;
	private List<ApprLineDto> apprLines;
}
