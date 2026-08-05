package com.sb.erp.com.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CompanySearchRequest {
	private String keyword;
	private String industryGrpCode;

	private long comId;
	private String comName;

	@Builder.Default
	private int onepagelist = 10;
	@Builder.Default
	private int pstartno = 1;

	// 검색 조건이 비어있는지 확인 여부
	public boolean hasSearchCondition() {
		return (keyword != null && !keyword.isEmpty())
			|| (industryGrpCode != null && !industryGrpCode.isEmpty());
		// 검색 필드 추가될 때마다 여기에 || 조건 추가
	}

}