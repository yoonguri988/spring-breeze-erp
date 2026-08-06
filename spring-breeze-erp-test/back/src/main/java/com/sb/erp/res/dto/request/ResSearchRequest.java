package com.sb.erp.res.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResSearchRequest {
	private Long comId;
	private String keyword;
	private String resType;
	private String resStatus;

	// 페이징
	@Builder.Default
	private int pstartno = 1;
	@Builder.Default
	private int onepagelist = 10;

	// 검색 조건이 비어있는지 확인 여부
	public boolean hasSearchCondition() {
		return (keyword != null && !keyword.isEmpty())
				|| (resType != null && !resType.isEmpty())
				|| (resStatus != null && !resStatus.isEmpty());
		// 검색 필드 추가될 때마다 여기에 || 조건 추가
	}
}