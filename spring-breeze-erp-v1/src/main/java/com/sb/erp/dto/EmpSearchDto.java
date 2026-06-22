package com.sb.erp.dto;

import lombok.Data;

@Data
public class EmpSearchDto {
	
	private Integer deptId;
	private Integer posId;
	private String empStatus;
	private String keyword;
	private Integer comId;
	
	private Integer page; // 현재 페이지
	private int pstartno;
	private int onepagelist;

}
