package com.sb.erp.emp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter @Getter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmpResponse {
	private long empId;
	private String empNo;
	private String empName;
	private String empEmail;
	private String empMobile;
	private String empStatus;
	private String hireDate;
	private String createdAt;
	private String posName;
	private String deptName;
	private String comName;
}