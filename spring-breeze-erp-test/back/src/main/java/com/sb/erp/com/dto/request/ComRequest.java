package com.sb.erp.com.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter @Getter @NoArgsConstructor @AllArgsConstructor @Builder
public class ComRequest {
	private long comId;
	private String industryGrpCode;
	private String industryCode;
	private String comName;
	private String comCeo;
	private String bizNo;
	private String comTel;  // 필수 아님
	private String comLogo; // 필수 아님
}
