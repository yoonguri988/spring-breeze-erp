package com.sb.erp.emp.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class EmpRequest {
	private Long empId;
	private String empNo;
	private String empPass;
	private String empName;
	private String empEmail;
	private String empMobile;
	private String empStatus;
	private String hireDate;
	private Long posId;
	private Long deptId;
	private Long comId;
}
