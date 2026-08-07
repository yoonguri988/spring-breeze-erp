package com.sb.erp.emp.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EmpResponse {
	private Long empId;
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
