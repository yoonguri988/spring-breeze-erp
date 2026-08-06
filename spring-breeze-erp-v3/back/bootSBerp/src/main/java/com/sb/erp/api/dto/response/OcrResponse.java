package com.sb.erp.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OcrResponse {
	private String bizNo;            // 사업자등록번호
	private String comName;          // 회사명
	private String comCeo;           // 대표자명
	private String startDt;          // 개업일자 -> yyyy-MM-dd 로 정규화
	private String industryGrpText;  // 업종
	private String industryCodeText; // 세부업종
}