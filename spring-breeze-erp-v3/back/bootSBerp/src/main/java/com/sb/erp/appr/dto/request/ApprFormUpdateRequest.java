package com.sb.erp.appr.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "결재 양식 수정 요청")
public class ApprFormUpdateRequest {
	
	@NotNull(message = "회사를 선택해주세요")
	private Integer comId;
	
	@NotBlank(message = "양식 코드를 입력해주세요")
	private String forCode;
	
	@NotBlank(message = "양식 제목을 입력해주세요")
	private String forTitle;
	
	private String forContent;
	private String forSchema;
	private Boolean forStatus;
}
