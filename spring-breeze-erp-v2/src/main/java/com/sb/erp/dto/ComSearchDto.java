package com.sb.erp.dto;

import lombok.Data;

@Data
public class ComSearchDto {
	private String keyword;
	private String industCode;
	
	private int onepagelist = 10;
	private int pstarValue = 1;
}
