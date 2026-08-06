package com.sb.erp.emp.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class EmpSearchRequest {
	private String keyword;
	private String empStatus;
	private String posCode;
	private String deptName;
	private long comId;

	private int onepagelist = 10;
	private int pstartno = 1;
}
