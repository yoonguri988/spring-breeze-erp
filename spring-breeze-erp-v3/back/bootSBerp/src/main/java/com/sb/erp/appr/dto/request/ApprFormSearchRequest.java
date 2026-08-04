package com.sb.erp.appr.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "결재 양식 목록 검색 조건")
public class ApprFormSearchRequest {
	
	@Schema(description = "양식 코드/제목 검색어")
	private String keyword;
	
	@Schema(description = "회사 ID 필터")
	private Integer comId;
	
	@Schema(description = "회사 이름 필터 / 프론트 표시용")
	private String comName;
	
	@Schema(description = "활성화 상태 필터")
	private Boolean forStatus;
	
	@Schema(description = "페이지 번호 / 1부터 시작", defaultValue = "1")
	private int page = 1;
}
