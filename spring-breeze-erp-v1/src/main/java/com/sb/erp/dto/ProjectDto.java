package com.sb.erp.dto;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class ProjectDto {
	private int proId;
	private int comId;
	private int empId;
	private String proStatus;
	private String proName;
	private String proDesc;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date startDate;
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date endDate;
	private Date createdAt;
	private Date updatedAt;
	private String empName;
	
	private int memberCnt; //프로젝트 멤버 인원 db값 존재하지않는 컬럼
	public int getMemberCnt() { return memberCnt; }
	public void setMemberCnt(int memberCnt) { this.memberCnt = memberCnt; }
	
	
}
