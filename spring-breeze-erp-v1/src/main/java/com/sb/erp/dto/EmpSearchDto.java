package com.sb.erp.dto;

import lombok.Data;

@Data
public class EmpSearchDto {
	
	private Integer deptId;
	private Integer posId;
	private String empStatus;
	private String keyword;

}
