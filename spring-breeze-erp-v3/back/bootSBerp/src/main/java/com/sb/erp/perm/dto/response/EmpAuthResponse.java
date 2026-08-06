package com.sb.erp.perm.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EmpAuthResponse {
	private long empAutId;
	private long empId;
	private String empName;
	private String empNo;
	private long autId;
	private String autName;
	private String posName;
	private String deptName;
}
