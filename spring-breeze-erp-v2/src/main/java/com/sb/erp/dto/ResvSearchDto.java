package com.sb.erp.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ResvSearchDto {
	private int comId;
	private Integer empId;
	private String status;
	
	// 페이징
	private int pstartno = 1;
	private int onepagelist = 10;
}
