package com.sb.erp.dto;

import lombok.Data;

@Data
public class ApprFormSearchDto { // 양식 리스트 검색용
	private String searchKeyword; // 문자열 회사 검색 키워드 
	private int comId; //  회사 선택 -> 전체 선택시 0으로
	private boolean forStatus; // 활성화 비활성화
}
