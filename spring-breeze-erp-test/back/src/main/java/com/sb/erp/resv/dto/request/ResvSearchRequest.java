package com.sb.erp.resv.dto.request;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResvSearchRequest {
	private Long comId;
	private Long empId;
	private Long resId;
	private Long excludeRevId;

	private String status;
	private String resType;
	private LocalDateTime startDt;
	private LocalDateTime endDt;
	private String keyword;

	// 페이징
	@Builder.Default
	private int pstartno = 1;
	@Builder.Default
	private int onepagelist = 10;

	// 검색 조건이 비어있는지 확인 여부
	public boolean hasSearchCondition() {
		return (keyword != null && !keyword.isEmpty())
				|| (status != null && !status.isEmpty())
				|| (startDt != null)
				|| (endDt != null)
				|| (resType != null && !resType.isEmpty());
		// 검색 필드 추가될 때마다 여기에 || 조건 추가
	}
}