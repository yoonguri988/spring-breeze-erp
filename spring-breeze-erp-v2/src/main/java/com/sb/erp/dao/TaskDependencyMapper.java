package com.sb.erp.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import com.sb.erp.dto.TaskDto;

@Mapper
public interface TaskDependencyMapper {
	
   //선행 태스크를 지정하여 태스크 생성
   public int insertWithParent(TaskDto dto);
   
   //태스크 의존성 트리 조회
   public List<TaskDto> selectTaskDependencies(int proId);
   
   //태스크 일정 및 선행 태스크 수정
   public int updateTaskSchedule(TaskDto dto);
   
   //벌크 연쇄 업데이트
   public void updateBatchTaskSchedule(List<TaskDto> list);
	
}
