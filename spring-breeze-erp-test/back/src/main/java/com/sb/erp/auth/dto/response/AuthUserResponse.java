package com.sb.erp.auth.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthUserResponse {
	
	private String empNo;
	private String empName;
	private String empEmail;
	private String empPass;
	private String posName;
	private String comName;
	private List<AuthResponse> authList;
	
	private long empId;
	private long comId;
	private long deptId;
	private long posId;
	
}