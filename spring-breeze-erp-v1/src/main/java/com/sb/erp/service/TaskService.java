package com.sb.erp.service;

import java.util.List;

import com.sb.erp.dto.TaskDto;

public interface TaskService {
	public int insert(TaskDto dto);
	public List<TaskDto> selectAll(int pro_id);
	public int delete(int task_id);
	public int update(TaskDto dto);
	public TaskDto select(int task_id);
	public TaskDto taskEditView(int task_id);
	
}
