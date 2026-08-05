package com.sb.erp.service;

import java.util.List;

import com.sb.erp.dto.MyWeeklyReportDto;
import com.sb.erp.dto.TaskDto;
import com.sb.erp.dto.TaskSearchDto;

public interface TaskService {
	
	//태스크 추가
	public int insert(TaskRequest dto);
	
	//태스크 참여 명단 조회
	public List<TaskRequest> selectAll(TaskSearchRequest search);
	
	//태스크 개수 카운트
	public int selectCnt(int proId);
	
	//태스크 삭제
	public int delete(int taskId);
	
	//태스크 수정
	public int update(TaskRequest dto);
	
	//태스크 상세 조회
	public TaskRequest select(int taskId);
	
	//태스크 수정뷰
	public TaskRequest taskEditView(int taskId);
	
	//태스크 주간 보고서
	public MyWeeklyReportResponse myWeeklyReport(int empId);
	
	//지연 태스크 목록
	public List<String>delayedTaskNames(int empId);
	
	//pdf보고서 생성
	public byte[] createMyWeeklyReport(MyWeeklyReportResponse dto);
	
	//내 태스크 목록조회
	public List<TaskRequest> selectMyTasks(TaskSearchRequest search);
	public int selectMyTasksCount(TaskSearchRequest search);
	
	//태스크 목록
	public List<TaskRequest> selectTaskList(int proId);
}
