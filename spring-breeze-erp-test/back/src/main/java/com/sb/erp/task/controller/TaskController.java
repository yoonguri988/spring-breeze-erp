package com.sb.erp.task.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.proj.dto.response.ProjResponse;
import com.sb.erp.proj.dto.response.ProjmemResponse;
import com.sb.erp.proj.service.ProjectMemberService;
import com.sb.erp.proj.service.ProjectService;
import com.sb.erp.task.dto.reponse.TaskResponse;
import com.sb.erp.task.dto.request.TaskRequest;
import com.sb.erp.task.dto.request.TaskSearchRequest;
import com.sb.erp.task.service.TaskDependencyService;
import com.sb.erp.task.service.TaskService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Task Api", description = "Task 관련 Api")
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {
	private final TaskService service;
	private final ProjectMemberService memberservice;
	private final TaskDependencyService dependencyService; 
	private final ProjectService projectService;
	
	// 태스크 등록에 필요한 참고 데이터(멤버 목록, 선행작업 후보 목록) 조회
	@Operation(summary = "태스크 등록 참고 데이터", description = "등록 폼에 필요한 프로젝트 멤버/선행작업 후보 목록을 조회합니다.")
	@GetMapping("/create-context")
	public ResponseEntity<Map<String, Object>> getCreateContext(@RequestParam("projectProId") Long projectProId) {
		ProjResponse project = projectService.select(projectProId);
		if (project == null) {
			return ResponseEntity.notFound().build();
		}

		Map<String, Object> result = new HashMap<>();
		result.put("memberList", memberservice.selectByproject(projectProId));
		result.put("taskList", dependencyService.selectTaskDependencies(projectProId));
		return ResponseEntity.ok(result);
	}
	
	// 태스크 등록
	@Operation(summary = "태스크 등록", description = "신규 태스크를 등록합니다.")
	@PostMapping
	public ResponseEntity<Map<String, Object>> createTask(@RequestBody TaskRequest dto) {

		Map<String, Object> result = new HashMap<>();

		ProjResponse project = projectService.select(dto.getProId());
		if (project == null) {
			return ResponseEntity.notFound().build();
		}
	    
		ProjmemResponse member = memberservice.selectOne(dto.getPmId());
		if (member == null) {
			result.put("success", false);
			result.put("message", "유효하지 않은 담당자입니다.");
			return ResponseEntity.badRequest().body(result);
		}

		try {
			int inserted = dependencyService.insertWithParent(dto);
			if (inserted > 0) {
				result.put("success", true);
				result.put("message", "태스크 등록 성공");
				return ResponseEntity.status(HttpStatus.CREATED).body(result);
			}
			result.put("success", false);
			result.put("message", "태스크 등록 실패");
			return ResponseEntity.internalServerError().body(result);

		} catch (IllegalArgumentException | IllegalStateException e) {
			result.put("success", false);
			result.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(result);
		}
	}
	
	// 태스크 상세조회
	@Operation(summary = "태스크 상세조회", description = "태스크 상세 정보 + 선행작업 + 영향받는 후속작업을 조회합니다.")
	@GetMapping("/{taskId}")
	public ResponseEntity<Map<String, Object>> getTask(@PathVariable("taskId") Long taskId) {

		TaskResponse dto = service.select(taskId);
		if (dto == null) {
			return ResponseEntity.notFound().build();
		}

		Map<String, Object> result = new HashMap<>();
		result.put("task", dto);
		result.put("proId", dto.getProId());
		
		if (dto.getParentTaskId() != null) {
			result.put("parentTask", service.select(dto.getParentTaskId()));
		}

		result.put("impactTasks", dependencyService.selectImpactTasks(taskId));

		boolean isDelayed = !"DONE".equals(dto.getTaskStatus())
				&& dto.getTaskEndDate().isBefore(LocalDate.now());
		result.put("isDelayed", isDelayed);

		return ResponseEntity.ok(result);
	}
	 	  
	// 태스크 수정에 필요한 참고 데이터 
	@Operation(summary = "태스크 수정 참고 데이터", description = "수정 폼에 필요한 태스크 정보 + 멤버/선행작업 후보 목록을 조회합니다.")
	@GetMapping("/{taskId}/edit-context")
	public ResponseEntity<Map<String, Object>> getEditContext(
			@PathVariable("taskId") Long taskId,
			@RequestParam("projectProId") Long projectProId) {

		TaskResponse task = service.select(taskId);
		if (task == null) {
			return ResponseEntity.notFound().build();
		}

		Map<String, Object> result = new HashMap<>();
		result.put("task", service.taskEditView(taskId));
		result.put("taskList", dependencyService.selectTaskDependencies(projectProId));
		result.put("memberList", memberservice.selectByproject(projectProId));
		return ResponseEntity.ok(result);
	}
		  
	// 태스크 수정
	@Operation(summary = "태스크 수정", description = "태스크 일정/상태 등을 수정합니다.")
	@PutMapping("/{taskId}")
	public ResponseEntity<Map<String, Object>> updateTask(
			@PathVariable("taskId") Long taskId,
			@RequestBody TaskRequest dto) {

		dto.setTaskId(taskId);
		Map<String, Object> result = new HashMap<>();

		TaskResponse original = service.select(taskId);
		if (original == null) {
			return ResponseEntity.notFound().build();
		}

		try {
			int updated = dependencyService.updateTaskSchedule(dto);
			if (updated > 0) {
				result.put("success", true);
				result.put("message", "태스크 수정 성공");
				return ResponseEntity.ok(result);
			}
			result.put("success", false);
			result.put("message", "태스크 수정 실패");
			return ResponseEntity.internalServerError().body(result);

		} catch (IllegalArgumentException | IllegalStateException e) {
			result.put("success", false);
			result.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(result);
		}
	}
	  
	// 태스크 삭제
	@Operation(summary = "태스크 삭제", description = "태스크를 삭제합니다.")
	@DeleteMapping("/{taskId}")
	public ResponseEntity<Map<String, Object>> deleteTask(
			@PathVariable("taskId") Long taskId,
			@RequestParam("proId") Long proId) {

		Map<String, Object> result = new HashMap<>();

		ProjResponse project = projectService.select(proId);
		if (project == null) {
			return ResponseEntity.notFound().build();
		}
		  
		int deleted = service.delete(taskId);
		if (deleted > 0) {
			result.put("success", true);
			result.put("message", "태스크 삭제 성공");
			return ResponseEntity.ok(result);
		}

		result.put("success", false);
		result.put("message", "해당 태스크를 찾을 수 없습니다.");
		return ResponseEntity.notFound().build();
	}
	    	
	// 내 태스크 목록
	@Operation(summary = "내 태스크 목록 조회", description = "로그인한 사용자가 담당자로 지정된 태스크 목록을 조회합니다.")
	@GetMapping("/mine")
	public ResponseEntity<Map<String, Object>> getMyTasks(@ModelAttribute TaskSearchRequest search){
		List<TaskResponse> tasks = service.selectMyTasks(search);

		for (TaskResponse task : tasks) {
			boolean delayed = !"DONE".equals(task.getTaskStatus())
					&& task.getTaskEndDate().isBefore(LocalDate.now());
			task.setDelayed(delayed);
		}

		Map<String, Object> result = new HashMap<>();
		result.put("tasks", tasks);
		return ResponseEntity.ok(result);
	}
		
	// 간트 차트
	@Operation(summary = "간트차트 조회", description = "프로젝트의 태스크 의존관계를 간트차트용으로 조회합니다.")
	@GetMapping("/gantt")
	public ResponseEntity<List<TaskResponse>> gantt(@RequestParam("proId") Long proId) {

		ProjResponse project = projectService.select(proId);
		if (project == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(dependencyService.selectTaskDependencies(proId));
	}
}