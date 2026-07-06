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
	
	private String docName; // 이거 왜쓴지 기억이 안남 작성하다 필요없는거같으면 지우기
	private List<ApprLineDto> apprLines;
}
