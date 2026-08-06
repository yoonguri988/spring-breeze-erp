package com.sb.erp.perm.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter @Getter @NoArgsConstructor @AllArgsConstructor @Builder
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