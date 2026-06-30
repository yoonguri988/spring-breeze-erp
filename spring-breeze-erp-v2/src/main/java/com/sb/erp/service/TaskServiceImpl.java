package com.sb.erp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.TaskMapper;
import com.sb.erp.dto.TaskDto;

@Service
public class TaskServiceImpl implements TaskService {
	@Autowired TaskMapper dao;
		
	//태스크 추가
	@Override public int insert(TaskDto dto) {  return dao.insert(dto); }

	//태스크 참여 명단 조회
	@Override public List<TaskDto> selectAll(int pro_id) {  return dao.selectAll(pro_id); }
	
	//태스크 삭제
	@Override public int delete(int task_id) {  return dao.delete(task_id); }
	
	//태스크 수정
	@Override public int update(TaskDto dto) {  return dao.update(dto); }
	
	//태스크 상세조회
	@Override public TaskDto select(int task_id) {  return dao.select(task_id); }
	
	//태스크 수정뷰
	@Override public TaskDto taskEditView(int task_id) { return dao.select(task_id); }
	
}
