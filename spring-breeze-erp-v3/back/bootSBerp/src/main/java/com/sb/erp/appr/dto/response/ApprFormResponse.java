package com.sb.erp.appr.dto.response;

import com.sb.erp.appr.dto.ApprFormDto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "결재 양식 목록 항목")
public class ApprFormResponse {
	
	private int forId;
	private int forVersion;
	private int comId;
	private String comName;
	private String forCode;
	private String forTitle;
	private Boolean forStatus;
	private String createdAt;
	private String updatedAt;
	
	public static ApprFormResponse from(ApprFormDto dto) {
		return ApprFormResponse.builder()
				.forId(dto.getForId())
				.forVersion(dto.getForVersion())
				.comId(dto.getComId())
				.comName(dto.getComName())
				.forCode(dto.getForCode())
				.forTitle(dto.getForTitle())
				.forStatus(dto.getForStatus())
				.createdAt(dto.getCreatedAt())
				.updatedAt(dto.getUpdatedAt())
				.build();
	}
}
