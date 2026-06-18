package com.sb.erp.dto;

import lombok.Data;

@Data
public class TaskDto {
	private int taskId;
	private int proId;
	private int comId;
	private String taskName;
	private String taskDesc;
	private int pmId;
	private String pmIdName;
	private String taskStartDate;
	private String taskEndDate;
	private String taskCreatedAt;
	private String taskUpdatedAt;
}
