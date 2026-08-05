package com.sb.erp.appr.dto.response;

import com.sb.erp.appr.dto.ApprFormDto;
import com.sb.erp.appr.entity.ApprForm;

import lombok.Getter;

@Getter
public class ApprFormResponse {
	private Long forId;
	private Long forVersion;
	private Long comId;
	private String comName;
	private String forCode;
	private String forTitle;
	private String forContent;
	private String forSchema;
	private Boolean forStatus;
	private String createdAt;
	private String updatedAt;
	
	// JPA 경로 - Entity에서 변환
	public ApprFormResponse(ApprForm form) {
		this.forId = form.getForId();
		this.forVersion = form.getForVersion();
		this.comId = form.getCompany().getId();
		this.comName = form.getCompany().getComName();
		this.forCode = form.getForCode();
		this.forTitle = form.getForTitle();
		this.forContent = form.getForContent();
		this.forSchema = form.getForSchema();
		this.forStatus = form.getForStatus();
		this.createdAt = form.getCreatedAt() != null ? form.getCreatedAt().toString() : null;
		this.updatedAt = form.getUpdatedAt() != null ? form.getUpdatedAt().toString() : null;
	}
	
	// MyBatis 경로 - Dto에서 변환
	public ApprFormResponse(ApprFormDto dto) {
		this.forId = (long) dto.getForId();
		this.forVersion = (long) dto.getForVersion();
		this.comId = (long) dto.getComId();
		this.comName = dto.getComName();
		this.forCode = dto.getForCode();
		this.forTitle = dto.getForTitle();
		this.forContent = dto.getForContent();
		this.forSchema = dto.getForSchema();
		this.forStatus = dto.getForStatus();
		this.createdAt = dto.getCreatedAt();
		this.updatedAt = dto.getUpdatedAt();
	}
}
