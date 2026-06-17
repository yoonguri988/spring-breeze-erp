package com.sb.erp.dto;

import lombok.Data;

@Data
public class ProjectDto {
	private int pro_id;
	private int com_id;
	private int emp_id;
	private String pro_status;
	private String pro_name;
	private String pro_desc;
	private String start_date;
	private String end_date;
	private String created_at;
	private String updated_at;
	private String emp_name;
}
