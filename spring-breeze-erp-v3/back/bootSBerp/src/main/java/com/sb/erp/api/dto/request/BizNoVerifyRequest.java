package com.sb.erp.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BizNoVerifyRequest {

	@NotBlank(message = "사업자번호는 필수입니다")
	@Pattern(regexp = "\\d{3}-?\\d{2}-?\\d{5}", message = "사업자번호 형식이 올바르지 않습니다")
	private String bizNo;

	@NotBlank(message = "개업일자는 필수입니다")
	private String startDt;

	@NotBlank(message = "대표자명은 필수입니다")
	private String ceoName;
}