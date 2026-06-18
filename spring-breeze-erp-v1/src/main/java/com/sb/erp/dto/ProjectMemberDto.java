package com.sb.erp.dto;

import java.time.LocalDateTime;
import java.util.Date;

import lombok.Data;

@Data
public class ProjectMemberDto {
	private int pmId;
	private int projectProId;
	private int empId;
	private String role;
	private Date joinedAt;
	private String empName;
	private String proName;
	
}
