package com.sb.erp.com.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//Request
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CompanySearchDto {
	private String keyword;
	private String industryGrpCode;
	private String industryCode;
	
	private int comId;
	private String comName;
	
	private int onepagelist = 10;
	private int pstartno = 1;
	
	public CompanySearchDto(int comId, String comName) {
		super();
		this.comId = comId;
		this.comName = comName;
	}  
	
	
	// 검색 조건이 비어있는지 확인 여부
	public boolean hasSearchCondition() {
        return (keyword != null && !keyword.isEmpty())
            || (industryGrpCode != null && !industryGrpCode.isEmpty())
            || (industryCode != null && !industryCode.isEmpty());
        // 검색 필드 추가될 때마다 여기에 || 조건 추가
	}

}
