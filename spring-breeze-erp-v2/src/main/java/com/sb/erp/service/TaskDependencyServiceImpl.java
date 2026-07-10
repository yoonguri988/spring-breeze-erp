package com.sb.erp.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.dao.TaskDependencyMapper;
import com.sb.erp.dto.TaskDto;

@Service
@Transactional
public class TaskDependencyServiceImpl implements TaskDependencyService{
	@Autowired TaskDependencyMapper dao;
	
	//선행 태스크를 지정하여 태스크 생성
	@Override public int insertWithParent(TaskDto dto) {  
		if(dto.getParentTaskId()!=null) {
			List<TaskDto> tasks=dao.selectTaskDependencies(dto.getProId());
			TaskDto parent = tasks.stream()
							.filter(t->t.getTaskId().equals(dto.getParentTaskId()))
							.findFirst()
							.orElseThrow(()->new IllegalArgumentException("지정한 선행 태스크가 존재하지 않습니다."));
			if(dto.getTaskStartDate().isBefore(parent.getTaskEndDate())) {
				throw new IllegalArgumentException("비지니스 제약 오류:시작일은 선행 작업 종료일 이후여야 합니다.");
			}
		}
		
		return dao.insertWithParent(dto); 
		}
	
	//태스크 의존성 트리 조회
	@Override public List<TaskDto> selectTaskDependencies(int proId) {  return dao.selectTaskDependencies(proId); }
	
	//태스크 일정 및 선행 태스크 수정
	@Override public int updateTaskSchedule(TaskDto dto) {  
		
		//1)순환 참조(데드락)방지 체크
		if(dto.getParentTaskId()!=null && isCyclic(dto.getTaskId(),dto.getParentTaskId(),dto.getProId())) {
			throw new IllegalArgumentException("일정 데드락 위험:순환 의존성을 형성할 수 없습니다.");
		}
		
		//2)단일 태스크 단일 수정 실행
		int result = dao.updateTaskSchedule(dto);
		
		//3)전체 태스크 목록 재조회(선행->후행 순 정렬된 상태)
		List<TaskDto> allTasks = dao.selectTaskDependencies(dto.getProId());
		
		//4)연쇄적으로 밀려야 하는 후속 태스크들만 추려서 리스트에 담기
		List<TaskDto> targetList = new ArrayList<>();
		
		for(TaskDto task : allTasks) {
			if(task.getParentTaskId()==null) {continue;}
			TaskDto parent = allTasks.stream()
									 .filter(t->t.getTaskId().equals(task.getParentTaskId()))
									 .findFirst()
									 .orElse(null);
			if(parent ==null) {continue;}//부모 못 찾으면 건너뜀(NPE 방지)
			if(parent.getTaskEndDate().isAfter(task.getTaskStartDate()))
			{
				long taskDuration = ChronoUnit.DAYS.between(task.getTaskStartDate(), task.getTaskEndDate());
				LocalDate nextStartDate = task.getTaskEndDate().plusDays(1);
				LocalDate nextEndDate = nextStartDate.plusDays(taskDuration);
				
				task.setTaskStartDate(nextStartDate);
				task.setTaskEndDate(nextEndDate);
				targetList.add(task);
			}		
		}		//5)밀린 태스크가 있으면 벌크 업데이트 실행
				if(!targetList.isEmpty()) {dao.updateBatchTaskSchedule(targetList);}
		
		
		return result; }

	//벌크 연쇄 업데이트
	@Override public void updateBatchTaskSchedule(List<TaskDto> list) { dao.updateBatchTaskSchedule(list); }

	// DFS 기반 순환 참조 역방향 추적
	private boolean isCyclic(Integer taskId,Integer parentTaskId,Integer proId) {

		List<TaskDto> list = dao.selectTaskDependencies(proId);
		Integer pointer = parentTaskId;

		while (pointer != null) {
			if (pointer.equals(taskId)) {
				return true;
			}
			final Integer currentFindId = pointer;
			pointer = list.stream()
					.filter(t -> t.getTaskId().equals(currentFindId))
					.map(TaskDto::getParentTaskId)
					.findFirst()
					.orElse(null);
		}
		return false;
	}
}
