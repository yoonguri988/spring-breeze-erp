package com.sb.erp.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.sb.erp.dto.TaskDto;
import com.sb.erp.dto.TaskSearchDto;

@Mapper
public interface TaskMapper {
	//태스크 등록
	public int insert(TaskDto dto);
	
	//태스크 페이징
	public List<TaskDto> selectAll(TaskSearchDto search);
	public int selectCnt (int proId);
	
	//태스크 삭제
	public int delete(int taskId);
	
	//태스크 삭제
	public int update(TaskDto dto);
	
	//태스크 상세
	public TaskDto select(int taskId);
}
