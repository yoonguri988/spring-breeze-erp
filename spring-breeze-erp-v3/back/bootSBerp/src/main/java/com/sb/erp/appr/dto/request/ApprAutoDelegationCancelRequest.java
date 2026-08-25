package com.sb.erp.appr.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApprAutoDelegationCancelRequest {
	
	@NotBlank(message = "취소 사유를 입력해주세요.")
	private String cancReason;
}
