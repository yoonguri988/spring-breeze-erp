package com.sb.erp.dto;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class TaskDto {
	private int taskId;
	private int proId;
	private int comId;
	private String taskName;
	private String taskDesc;
	private String taskStatus;
	private int pmId;
	private String pmIdName;
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date taskStartDate;
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date taskEndDate;
	private Date taskCreatedAt;
	private Date taskUpdatedAt;
}
