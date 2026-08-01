package com.sb.erp.appr.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "결재 양식 등록 요청")
public class ApprFormCreateRequest {
	
	@NotNull(message = "회사를 선택해주세요.")
	@Schema(description = "양식을 등록할 회사 ID", example = "1")
	private Integer comId;
	
	@NotBlank(message = "양식 코드를 입력해주세요.")
	@Schema(description = "양식 코드 / 회사 내 유니크 값", example = "TEST-01")
	private String forCode;
	
	@NotBlank(message = "양식 제목을 입력해주세요.")
	@Schema(description = "양식 제목")
	private String forTitle;
	
	@Schema(description = "에디터로 작성한 양식 본문")
	private String forContent;
	
	@Schema(description = "AI 생성 양식 스키마(JSON)")
	private String forSchema;
	
	@Schema(description = "양식 활성화 여부", example = "true")
	private Boolean forStatus;
}
