package com.sb.erp.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class TaskDto {
	private Integer taskId;
	private Integer proId;
	private Integer comId;
	private String taskName;
	private String taskDesc;
	private String taskStatus;
	private Integer pmId;
	private String pmName;
	private LocalDate taskStartDate;
	private LocalDate taskEndDate;
	private LocalDate actualStartDate; // 실제 착수일
	private LocalDate actualEndDate; //실제 완요일
	private LocalDate createdAt;
	private LocalDate updatedAt;
}
