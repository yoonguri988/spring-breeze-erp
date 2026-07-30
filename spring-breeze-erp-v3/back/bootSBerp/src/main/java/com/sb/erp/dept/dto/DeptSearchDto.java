package com.sb.erp.dept.dto;

import lombok.Getter;
import lombok.Setter;

//Request
@Getter @Setter
public class DeptSearchDto {
	private Integer comId;
	private Integer deptId;
	
	private String deptCode;
}
