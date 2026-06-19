package com.sb.erp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.TaskMapper;
import com.sb.erp.dto.TaskDto;

@Service
public class TaskServiceImpl implements TaskService {
	@Autowired TaskMapper dao;
		
	@Override public int insert(TaskDto dto) {  return dao.insert(dto); }

	@Override public List<TaskDto> selectAll(int pro_id) {  return dao.selectAll(pro_id); }

	@Override public int delete(int task_id) {  return dao.delete(task_id); }

	@Override public int update(TaskDto dto) {  return dao.update(dto); }

	@Override public TaskDto select(int task_id) {  return dao.select(task_id); }

	@Override public TaskDto taskEditView(int task_id) { return dao.select(task_id); }
	
}
