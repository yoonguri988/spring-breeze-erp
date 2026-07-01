package com.sb.erp.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.sb.erp.dto.TaskDto;

@Mapper
public interface TaskMapper {
	//태스크 등록
	public int insert(TaskDto dto);
	
	//태스크 멤버 조회
	public List<TaskDto> selectAll(int pro_id);
	
	//태스크 삭제
	public int delete(int task_id);
	
	//태스크 삭제
	public int update(TaskDto dto);
	
	//태스크 상세
	public TaskDto select(int task_id);
}
