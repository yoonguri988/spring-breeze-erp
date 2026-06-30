package com.sb.erp.service;

import java.util.List;

import com.sb.erp.dto.TaskDto;

public interface TaskService {
	
	//태스크 추가
	public int insert(TaskDto dto);
	
	//태스크 참여 명단 조회
	public List<TaskDto> selectAll(int pro_id);
	
	//태스크 삭제
	public int delete(int task_id);
	
	//태스크 수정
	public int update(TaskDto dto);
	
	//태스크 상세 조회
	public TaskDto select(int task_id);
	
	//태스크 수정뷰
	public TaskDto taskEditView(int task_id);
	
}
