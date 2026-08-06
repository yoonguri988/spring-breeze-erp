package com.sb.erp.res.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResRequest {
	private Long resId;

	@NotNull(message = "회사 정보는 필수입니다")
	private Long comId;

	@NotBlank(message = "자원코드는 필수입니다")
	private String resCode;

	@NotBlank(message = "자원명은 필수입니다")
	private String resName;

	@NotBlank(message = "자원유형은 필수입니다")
	private String resType;

	@NotNull(message = "수량은 필수입니다")
	private Long quantity;

	private String location;   // 필수 아님
	private Long capacity;     // 필수 아님
	private String resStatus;

	private Long managerEmpId; // 필수 아님
	private String remark;     // 필수 아님
}