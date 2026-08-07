package com.sb.erp.emp.dto.request;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter @Getter @NoArgsConstructor @AllArgsConstructor @Builder
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