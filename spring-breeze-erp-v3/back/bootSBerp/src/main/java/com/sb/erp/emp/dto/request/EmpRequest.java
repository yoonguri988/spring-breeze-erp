package com.sb.erp.emp.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class EmpRequest {
	private long empId;
	private String empNo;
	private String empPass;
	private String empName;
	private String empEmail;
	private String empMobile;
	private String empStatus;
	private String hireDate;
	private long posId;
	private long deptId;
	private long comId;
}
