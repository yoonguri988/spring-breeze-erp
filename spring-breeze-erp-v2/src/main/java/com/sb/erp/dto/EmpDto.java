package com.sb.erp.dto;

import lombok.Data;

@Data
public class EmpDto {
	
	private int empId; // 시스템 PK
	private String empNo; // 사번 (회사 부여, 가변)
	private String empName;
	private String empPass;
	private String empEmail;
	private String empMobile;
	private String empStatus; // 재직/휴직/퇴사 등 상태 표시
	private String hireDate;
	private String createdAt;
	private String updatedAt;
	private int deptId; // FK
	private int posId; // FK
	private int comId; // FK
	private String posName;
	private String deptName;
	
}
