package com.sb.erp.task.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

import com.sb.erp.emp.service.EmpService;
import com.sb.erp.global.oauth2.CustomUserPrincipal;
import com.sb.erp.proj.dto.response.ProjResponse;
import com.sb.erp.proj.dto.response.ProjmemResponse;
import com.sb.erp.proj.service.ProjectMemberService;
import com.sb.erp.proj.service.ProjectService;
import com.sb.erp.task.dto.request.TaskRequest;
import com.sb.erp.task.dto.request.TaskSearchRequest;
import com.sb.erp.task.dto.response.TaskResponse;
import com.sb.erp.task.service.TaskDependencyService;
import com.sb.erp.task.service.TaskService;
import com.sb.erp.util.dto.PagingUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Task Api", description = "Task 관련 Api")
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
	private final TaskService service;
	private final ProjectMemberService memberservice;
	private final EmpService empservice;
	private final TaskDependencyService dependencyService; 
	private final ProjectService projectService;
	
	// 태스크 등록에 필요한 참고 데이터(멤버 목록, 선행작업 후보 목록) 조회
	@Operation(summary = "태스크 등록 참고 데이터", description = "등록 폼에 필요한 프로젝트 멤버/선행작업 후보 목록을 조회합니다.")
	@GetMapping("/create-context")
	public ResponseEntity<Map<String, Object>> getCreateContext(
			@RequestParam("projectProId") Long projectProId,
			@AuthenticationPrincipal CustomUserPrincipal principal) {
		ProjResponse project = projectService.select(projectProId);
		if (project == null) {
			return ResponseEntity.notFound().build();
		}

		boolean isRoot = principal.getRoles().contains("ROOT");
		if (!isRoot && !project.getComId().equals(principal.getComId())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}

		Map<String, Object> result = new HashMap<>();
		result.put("memberList", memberservice.selectByproject(projectProId));
		result.put("taskList", dependencyService.selectTaskDependencies(projectProId));
		return ResponseEntity.ok(result);
	}
	
	// 태스크 등록
	// ★Authentication 
	@Operation(summary = "태스크 등록", description = "신규 태스크를 등록합니다.")
	@PostMapping
	public ResponseEntity<Map<String, Object>> createTask(
			@Valid @RequestBody TaskRequest dto,
			@AuthenticationPrincipal CustomUserPrincipal principal) {

		dto.setComId(principal.getComId());
		
		Map<String, Object> result = new HashMap<>();

		ProjResponse project = projectService.select(dto.getProId());
		if (project == null) {
			return ResponseEntity.notFound().build();
		}
		boolean isRoot = principal.getRoles().contains("ROOT");
		if (!isRoot && !project.getComId().equals(principal.getComId())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "접근 권한이 없습니다."));
		}

		boolean isAdmin = isRoot || principal.getRoles().contains("ROLE_ADMIN");
		boolean isCreator = project.getEmpId().equals(principal.getEmpId());
		boolean isMember = memberservice.select(dto.getProId()).stream()
				.anyMatch(m -> m.getEmpId().equals(principal.getEmpId()));

		if (!isAdmin && !isCreator && !isMember) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "접근 권한이 없습니다."));
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
				result.put("task", service.select(dto.getTaskId()));
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
	// ★Authentication 
	@Operation(summary = "태스크 상세조회", description = "태스크 상세 정보 + 선행작업 + 영향받는 후속작업을 조회합니다.")
	@GetMapping("/{taskId}")
	public ResponseEntity<Map<String, Object>> getTask(
			@PathVariable("taskId") Long taskId,
			@AuthenticationPrincipal CustomUserPrincipal principal) {

	 TaskResponse dto = service.select(taskId);
		if (dto == null) {
			return ResponseEntity.notFound().build();
		}

		ProjResponse project = projectService.select(dto.getProId());
		if (project == null) {
			return ResponseEntity.notFound().build();
		}

		boolean isRoot = principal.getRoles().contains("ROOT");
		if (!isRoot && !project.getComId().equals(principal.getComId())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "접근 권한이 없습니다."));
		}

		boolean isAdmin = isRoot || principal.getRoles().contains("ROLE_ADMIN");
		boolean isCreator = project.getEmpId().equals(principal.getEmpId());
		boolean isMember = memberservice.select(dto.getProId()).stream()
				.anyMatch(m -> m.getEmpId().equals(principal.getEmpId()));

		if (!isAdmin && !isCreator && !isMember) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "접근 권한이 없습니다."));
		}
		
		Map<String, Object> result = new HashMap<>();
		result.put("task", dto);
		result.put("proId", dto.getProId());
		
		// 선행 작업이 있으면 그 태스크 정보도 함께
		if (dto.getParentTaskId() != null) {
			result.put("parentTask", service.select(dto.getParentTaskId()));
		}

		// 이 태스크를 수정하면 영향을 받는 후속 작업들
		result.put("impactTasks", dependencyService.selectImpactTasks(taskId));

		// 지연 여부 판단 (완료 안 됐는데 마감일이 지남)
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
			@RequestParam("projectProId") Long projectProId,
			@AuthenticationPrincipal CustomUserPrincipal principal) {

		TaskResponse task = service.select(taskId);
		if (task == null) {
			return ResponseEntity.notFound().build();
		}

		ProjResponse project = projectService.select(task.getProId());
		if (project == null) {
			return ResponseEntity.notFound().build();
		}
		ProjmemResponse assignee = memberservice.selectOne(task.getPmId());

		boolean isRoot = principal.getRoles().contains("ROOT");
		if (!isRoot && !project.getComId().equals(principal.getComId())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "접근 권한이 없습니다."));
		}

		boolean isAdmin = isRoot || principal.getRoles().contains("ROLE_ADMIN");
		boolean isCreator = project.getEmpId().equals(principal.getEmpId());
		boolean isAssignee = assignee != null && assignee.getEmpId().equals(principal.getEmpId());

		if (!isAdmin && !isCreator && !isAssignee) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "담당자, 프로젝트 생성자만 수정할 수 있습니다."));
		}

		Map<String, Object> result = new HashMap<>();
		result.put("task", service.taskEditView(taskId));
		result.put("taskList", dependencyService.selectTaskDependencies(projectProId));
		result.put("memberList", memberservice.selectByproject(projectProId));
		return ResponseEntity.ok(result);
	}
		  
	  
	// 태스크 수정
	// ★Authentication 
	@Operation(summary = "태스크 수정", description = "태스크 일정/상태 등을 수정합니다.")
	@PutMapping("/{taskId}")
	public ResponseEntity<Map<String, Object>> updateTask(
			@PathVariable("taskId") Long taskId,
			@Valid @RequestBody TaskRequest dto,
			@AuthenticationPrincipal CustomUserPrincipal principal) {

		dto.setTaskId(taskId);
		dto.setComId(principal.getComId());
		Map<String, Object> result = new HashMap<>();

		TaskResponse original = service.select(taskId);
		if (original == null) {
			return ResponseEntity.notFound().build();
		}

		ProjResponse project = projectService.select(original.getProId());
		if (project == null) {
			return ResponseEntity.notFound().build();
		}
		ProjmemResponse assignee = memberservice.selectOne(original.getPmId());

		boolean isRoot = principal.getRoles().contains("ROOT");
		if (!isRoot && !project.getComId().equals(principal.getComId())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "접근 권한이 없습니다."));
		}

		boolean isAdmin = isRoot || principal.getRoles().contains("ROLE_ADMIN");
		boolean isCreator = project.getEmpId().equals(principal.getEmpId());
		boolean isAssignee = assignee != null && assignee.getEmpId().equals(principal.getEmpId());

		if (!isAdmin && !isCreator && !isAssignee) {
			result.put("success", false);
			result.put("message", "담당자, 프로젝트 생성자만 수정할 수 있습니다.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
		}
		try {
			int updated = dependencyService.updateTaskSchedule(dto);
			if (updated > 0) {
				result.put("success", true);
				result.put("message", "태스크 수정 성공");
				result.put("task", service.select(taskId));
				return ResponseEntity.ok(result);
			}
			result.put("success", false);
			result.put("message", "태스크 수정 실패");
			return ResponseEntity.internalServerError().body(result);

		} catch (IllegalArgumentException | IllegalStateException e) {
			// 멀티캐치: 순환참조(IllegalArgumentException), 완료된 프로젝트/동시수정 락 타임아웃(IllegalStateException)
			// 예상된 예외만 여기서 잡아서 사용자에게 메시지로 안내.
			// Exception으로 넓게 잡지 않는 이유: 의도치 않은 버그(NPE 등)까지 숨겨버리면 디버깅이 어려워지기 때문
			result.put("success", false);
			result.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(result);
		}
	  }
	  
	// 태스크 삭제
	// ★Authentication
	@Operation(summary = "태스크 삭제", description = "태스크를 삭제합니다.")
	@DeleteMapping("/{taskId}")
	public ResponseEntity<Map<String, Object>> deleteTask(
			@PathVariable("taskId") Long taskId,
			@RequestParam("proId") Long proId,
			@AuthenticationPrincipal CustomUserPrincipal principal) {

		Map<String, Object> result = new HashMap<>();

		ProjResponse project = projectService.select(proId);
		if (project == null) {
			return ResponseEntity.notFound().build();
		}
		  
		boolean isRoot = principal.getRoles().contains("ROOT");
		if (!isRoot && !project.getComId().equals(principal.getComId())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "접근 권한이 없습니다."));
		}

		// 삭제는 담당자 제외, 생성자/관리자만 가능
		boolean isAdmin = isRoot || principal.getRoles().contains("ROLE_ADMIN");
		boolean isCreator = project.getEmpId().equals(principal.getEmpId());
		if (!isAdmin && !isCreator) {
			result.put("success", false);
			result.put("message", "프로젝트 생성자만 삭제할 수 있습니다.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
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
	    // ★Authentication
	    @Operation(summary = "내 태스크 목록 조회", description = "로그인한 사용자가 담당자로 지정된 태스크 목록을 조회합니다.")
		@GetMapping("/mine")
	    public ResponseEntity<Map<String, Object>> getMyTasks(
	    		@ModelAttribute TaskSearchRequest search,
	    		@AuthenticationPrincipal CustomUserPrincipal principal){
	    	int totalCnt = service.selectMyTasksCount(search);
	    	
			search.setEmpId(principal.getEmpId());
			search.setComId(principal.getComId());
			
			PagingUtil paging = new PagingUtil(totalCnt, search.getPstartno());
			search.setPstartno(paging.getPstartno());
			List<TaskResponse> tasks = service.selectMyTasks(search);

			for (TaskResponse task : tasks) {
				boolean delayed = !"DONE".equals(task.getTaskStatus())
						&& task.getTaskEndDate().isBefore(LocalDate.now());
				task.setDelayed(delayed);
			}

			Map<String, Object> result = new HashMap<>();
			result.put("tasks", tasks);
			result.put("paging", paging);
			result.put("totalCnt", totalCnt);
			return ResponseEntity.ok(result);
		}
		
	    //간트 차트
		@Operation(summary = "간트차트 조회", description = "프로젝트의 태스크 의존관계를 간트차트용으로 조회합니다.")
		@GetMapping("/gantt")
		public ResponseEntity<List<TaskResponse>> gantt(
				@RequestParam("proId") Long proId,
				@AuthenticationPrincipal CustomUserPrincipal principal) {

			ProjResponse project = projectService.select(proId);
			if (project == null) {
				return ResponseEntity.notFound().build();
			}

			boolean isRoot = principal.getRoles().contains("ROOT");
			if (!isRoot && !project.getComId().equals(principal.getComId())) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
			}

			boolean isAdmin = isRoot || principal.getRoles().contains("ROLE_ADMIN");
			boolean isCreator = project.getEmpId().equals(principal.getEmpId());
			boolean isMember = memberservice.select(proId).stream()
					.anyMatch(m -> m.getEmpId().equals(principal.getEmpId()));

			if (!isAdmin && !isCreator && !isMember) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
			}
			return ResponseEntity.ok(dependencyService.selectTaskDependencies(proId));
		}//간트차트
}

/*@GetMapping("/task_create")
	public String createFrom(@RequestParam("project_pro_id") int projectProId, Model model,Authentication auth) {
		
		CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
		int empId = user.getUser().getEmpId();

		ProjRequest project = projectService.select(projectProId);
		SecurityUtil.checkComIdAccess(project.getComId());
		boolean isCreator = project.getEmpId() == empId;
		boolean isMember = memberservice.select(projectProId).stream()
		        .anyMatch(m -> m.getEmpId() == empId);

		if (!isCreator && !isMember) {
		    throw new AccessDeniedException("접근 권한이 없습니다.");
		}
		
		model.addAttribute("memberlist",memberservice.selectByproject(projectProId));
		model.addAttribute("taskList", dependencyService.selectTaskDependencies(projectProId));
		model.addAttribute("pro_id",projectProId);
		return "proj/task_create"; // 프로젝트 멤버 이름 출력
	}
	
	@PostMapping("/task_create") 
	public String create(TaskRequest dto, RedirectAttributes rttr,Authentication auth) {
		
	    CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
	    int empId = user.getUser().getEmpId();
	    int comId = user.getUser().getComId();
	    
	    ProjRequest project = projectService.select(dto.getProId());
	    SecurityUtil.checkComIdAccess(project.getComId());
	    boolean isCreator = project.getEmpId() == empId;
	    boolean isMember = memberservice.select(dto.getProId()).stream()
	            .anyMatch(m -> m.getEmpId() == empId);
	    
	    if (!isCreator && !isMember) {
	        throw new AccessDeniedException("접근 권한이 없습니다.");
	    }
	    
	    dto.setComId(comId);
	    
		ProjmRequest member = memberservice.selectOne(dto.getPmId());
		if (member == null) {
			rttr.addFlashAttribute("result", "유효하지 않은 담당자입니다.");
			return "redirect:/proj/proj_detail?pro_id=" + dto.getProId();
		}

		String result = "태스크 등록 실패";
		try {
			if (dependencyService.insertWithParent(dto) > 0) {
				result = "태스크 등록 성공";
			}
		} catch (IllegalArgumentException | IllegalStateException e) { 
			result = e.getMessage();
		}

		rttr.addFlashAttribute("result", result);
		return "redirect:/proj/proj_detail?pro_id=" + dto.getProId();
	}
	
	 @GetMapping("/task_detail")
	 public String view(@RequestParam("task_id") int taskId,Model model, Authentication auth) {
	 TaskRequest dto = service.select(taskId);
	 
	  // 회사 소속 검증: ROOT/ADMIN이 아니면 자기 회사 프로젝트의 태스크만 접근 가능
	  ProjRequest project = projectService.select(dto.getProId());
	  SecurityUtil.checkComIdAccess(project.getComId());
	  
	  model.addAttribute("dto",dto);
	  model.addAttribute("pro_id", dto.getProId());
	  
	  	// 선행 작업이 있으면 그 태스크 정보도 조회
		if (dto.getParentTaskId() != null) {
			model.addAttribute("parentDto", service.select(dto.getParentTaskId())); }
		
		// 이 태스크를 수정하면 영향을 받는 후속 작업들
		model.addAttribute("impactTasks", dependencyService.selectImpactTasks(taskId));
	
		// 지연 여부 판단 (완료 안 됐는데 마감일이 지남)
		boolean isDelayed = !"DONE".equals(dto.getTaskStatus())
				&& dto.getTaskEndDate().isBefore(LocalDate.now());
		model.addAttribute("isDelayed", isDelayed);
		
	  return "proj/task_detail";
	  } //해당 태스크 상세
	 	  
	 @GetMapping("/task_edit")
	 public String taskEditView(@RequestParam("task_id") int taskId,@RequestParam("project_pro_id") int projectProId, Model model, Authentication auth) {
		 
		 CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
		 int empId = user.getUser().getEmpId();

		 TaskRequest task = service.select(taskId);
		 ProjRequest project = projectService.select(task.getProId());
		 SecurityUtil.checkComIdAccess(project.getComId());
		 ProjmRequest assignee = memberservice.selectOne(task.getPmId());

		 boolean isCreator = project.getEmpId() == empId;
		 boolean isAssignee = assignee != null && assignee.getEmpId() == empId;

		 if (!isCreator && !isAssignee) {
		     throw new AccessDeniedException("접근 권한이 없습니다.");
		 }
		 
		  model.addAttribute("dto",service.taskEditView(taskId));
		  model.addAttribute("taskList", dependencyService.selectTaskDependencies(projectProId));
		  model.addAttribute("memberlist",memberservice.selectByproject(projectProId));
		  model.addAttribute("pro_id",projectProId);
		  return "proj/task_edit";  }//태스크 수정뷰
		  
	  
	  @PostMapping("/task_edit")
	  public String edit(TaskRequest dto,RedirectAttributes rttr, Authentication auth) {
		  CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
		  int empId = user.getUser().getEmpId();
		  //수정 권한 검증: ROOT/ADMIN, 프로젝트 생성자, 담당자 본인만 가능
		  TaskRequest original = service.select(dto.getTaskId());
		  ProjRequest project = projectService.select(original.getProId());
		  SecurityUtil.checkComIdAccess(project.getComId());
		  ProjmRequest assignee = memberservice.selectOne(original.getPmId());
		  
		  boolean isCreator = project.getEmpId() == empId;
		  boolean isAssignee = assignee != null && assignee.getEmpId() == empId;
		  
		  if (!isCreator && !isAssignee) {
			  rttr.addFlashAttribute("result", "담당자, 프로젝트 생성자만 수정할 수 있습니다.");
			  return "redirect:/proj/task_detail?task_id="+dto.getTaskId();
		  }
		  
		  String result= "태스크 수정 실패";
		    try {
		        if(dependencyService.updateTaskSchedule(dto) > 0) { result = "태스크 수정 성공"; }
		    } catch(IllegalArgumentException | IllegalStateException e) 
		    // 멀티캐치: 순환참조(IllegalArgumentException), 완료된 프로젝트/동시수정 락 타임아웃(IllegalStateException)
		    // 예상된 예외만 여기서 잡아서 사용자에게 메시지로 안내.
		    // Exception으로 넓게 잡지 않는 이유: 의도치 않은 버그(NPE 등)까지 숨겨버리면 디버깅이 어려워지기 때문
		    { result = e.getMessage(); }
			rttr.addFlashAttribute("result",result);
			return "redirect:/proj/task_detail?task_id="+dto.getTaskId();
	  } //태스크 수정폼
	  
	  @GetMapping("/task_delete")
	  public String delete(@RequestParam("task_id") int taskId, @RequestParam("pro_id") int proId,RedirectAttributes rttr
			  , Authentication auth) {
		  CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
		  int empId = user.getUser().getEmpId();
		  // 삭제 권한 검증: ROOT/ADMIN, 프로젝트 생성자만 가능 (담당자 본인은 제외)
		  ProjRequest project = projectService.select(proId);
		  SecurityUtil.checkComIdAccess(project.getComId());
		  boolean isCreator = project.getEmpId() == empId;

		  if (!isCreator) {
			  rttr.addFlashAttribute("result", "프로젝트 생성자만 삭제할 수 있습니다.");
			  return "redirect:/proj/proj_detail?pro_id="+proId;
		  }
		  
		  String result="태스크 삭제 실패";
		  if(service.delete(taskId)>0) {result="태스크 삭제 성공";}
		  rttr.addFlashAttribute("result",result);
		  return "redirect:/proj/proj_detail?pro_id="+proId;
	  }// 태스크 삭제
	  
	  
	    @GetMapping("/task_list")
	    public String myList(TaskSearchRequest search, Model model,Authentication auth) {
	    	CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
	    	int empId =user.getUser().getEmpId();
	    	int comId = user.getUser().getComId();
	    	
	    	   search.setEmpId(empId);
	    	   search.setComId(comId);

	        int totalCnt = service.selectMyTasksCount(search);
	        PagingUtil paging = new PagingUtil(totalCnt, search.getPstartno());
	        search.setPstartno(paging.getPstartno());
	        List<TaskRequest> tasks = service.selectMyTasks(search);

	        for (TaskRequest task : tasks) {
	            boolean delayed =
	                    !"DONE".equals(task.getTaskStatus())
	                    && task.getTaskEndDate().isBefore(LocalDate.now());

	            task.setDelayed(delayed);}

	        model.addAttribute("search", search);
	        model.addAttribute("tasks", tasks);
	        model.addAttribute("paging", paging);
	        model.addAttribute("totalCnt", totalCnt);
	        
	        
	        return "proj/task_list";
	    }// 내 태스크 목록 조회
		
		@GetMapping("/gantt")
		@ResponseBody
		public List<TaskRequest> gantt(@RequestParam("pro_id") int proId, Authentication auth){
			
		    ProjRequest project = projectService.select(proId);
		    SecurityUtil.checkComIdAccess(project.getComId());

			return dependencyService.selectTaskDependencies(proId);
		}//간트차트*/
