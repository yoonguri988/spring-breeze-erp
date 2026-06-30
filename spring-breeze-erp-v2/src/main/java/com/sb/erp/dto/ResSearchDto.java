package com.sb.erp.dto;

import lombok.Data;

@Data
public class ResSearchDto {
	private int comId;
	private String keyword;
	private String resType;
	
	// 페이징
	private int pstartno = 1;
	private int onepagelist = 10;
}
