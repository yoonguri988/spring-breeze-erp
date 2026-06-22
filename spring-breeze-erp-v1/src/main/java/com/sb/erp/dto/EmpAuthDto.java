package com.sb.erp.dto;

import lombok.Data;

@Data
public class EmpAuthDto {
	private int empId;
	private String empName;
	private String empNo;
	private int deptId; // FK
	private int posId; // FK
	private int comId; // FK
	private String posName;
	private String deptName;
}
