package com.sb.erp.appr.dto.response;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "결재 양식 목록 + 페이징 응답")
public class ApprFormListResponse {

	private List<ApprFormResponse> content;
	private int page;
	private int pageSize;
	private int totalCount;
	private int totalPages;
	
	public static ApprFormListResponse of(List<ApprFormResponse> content,
										  int page, int pageSize, int totalCount) {
		int totalPages = pageSize == 0 ? 0 : (int) Math.ceil((double) totalCount / pageSize);
		return ApprFormListResponse.builder()
				.content(content)
				.page(page)
				.pageSize(pageSize)
				.totalCount(totalCount)
				.totalPages(totalPages)
				.build();
	}
	
}
