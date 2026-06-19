package com.sb.erp.dto;

import lombok.Data;

@Data
public class PermDto {
	//공통
	private int autId;
	//authority
	private int comId;
	private String autName;
	
	//emp_auth
	private int empAutId;
	private int empId;
}
