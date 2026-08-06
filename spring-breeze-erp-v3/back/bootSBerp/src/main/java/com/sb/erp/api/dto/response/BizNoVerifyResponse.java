package com.sb.erp.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @NoArgsConstructor @AllArgsConstructor @Builder
public class BizNoVerifyResponse {
	private String bizNo;
	private String startDt;
	private String ceoName;
}