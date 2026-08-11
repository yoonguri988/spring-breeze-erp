package com.sb.erp.perm.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class PermRequest {
	private long autId;

	@NotBlank(message = "권한명은 필수입니다.")
	private String autName;

	// 컨트롤러/서비스에서 SecurityUtil로 세팅
	private long comId;
}
