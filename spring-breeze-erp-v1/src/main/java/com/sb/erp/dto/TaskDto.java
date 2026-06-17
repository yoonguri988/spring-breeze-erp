package com.sb.erp.dto;

import lombok.Data;

@Data
public class TaskDto {
	private int task_id;
	private int pro_id;
	private int com_id;
	private String task_name;
	private String task_desc;
	private int pm_id;
	private String pm_id_name;
	private String task_start_date;
	private String task_end_date;
	private String task_created_at;
	private String task_updated_at;
}
