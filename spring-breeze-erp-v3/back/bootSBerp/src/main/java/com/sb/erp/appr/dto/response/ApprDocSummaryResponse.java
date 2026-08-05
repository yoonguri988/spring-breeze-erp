package com.sb.erp.appr.dto.response;

import com.sb.erp.appr.dto.ApprDocDto;

import lombok.Getter;

@Getter
public class ApprDocSummaryResponse {
	private Long docId;
	private String docTitle;
	private Long empId;
	private String empName;
	private String docStatus;
	private boolean isImportant;
	private String createdAt;
	private String updatedAt;
	
	public ApprDocSummaryResponse(ApprDocDto dto) {
		// Map<String, Object> 에 타입 정보가 하나도 없어서
		// 뭘 꺼내든 Object로 나와서 직접 타입캐스팅해야 하므로 안전하게 Number로 받아서 .longValue로 통일
		this.docId = (long) dto.getDocId();
	}
}
