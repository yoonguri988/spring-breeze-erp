package com.sb.erp.dto;

import java.util.List;

import lombok.Data;

@Data
public class ApprDocDto {
	private int docId;
	private int forId;
	private int forVersion;
	private int empId;
	private int comId;
	private String docTitle;
	private String docContent;
	private String docStatus;
	private String createdAt;
	private String updatedAt;
	private boolean isImportant;
	private int docRevision;
	
	private String empName; // 리스트 기안자 출력 용도
	private List<ApprLineDto> apprLines; // 결재선 받아올 용도
}
