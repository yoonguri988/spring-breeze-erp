package com.sb.erp.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sb.erp.dto.ProjectMemberDto;
import com.sb.erp.dto.TaskDto;
import com.sb.erp.dto.TaskSearchDto;
import com.sb.erp.security.CustomUserDetails;
import com.sb.erp.service.EmpService;
import com.sb.erp.service.ProjectMemberService;
import com.sb.erp.service.TaskDependencyService;
import com.sb.erp.service.TaskService;
import com.sb.erp.util.PagingUtil;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/proj")
public class TaskController {
	@Autowired TaskService service;
	@Autowired ProjectMemberService memberservice;
	@Autowired EmpService empservice;
	@Autowired TaskDependencyService dependencyService; 
	
	@GetMapping("/task_create")
	public String createFrom(@RequestParam("project_pro_id") int projectProId, Model model) {
		model.addAttribute("memberlist",memberservice.selectByproject(projectProId));
		model.addAttribute("taskList", dependencyService.selectTaskDependencies(projectProId));
		model.addAttribute("pro_id",projectProId);
		return "proj/task_create"; // 프로젝트 멤버 이름 출력
	}
	
	@PostMapping("/task_create") 
	public String create(TaskDto dto, RedirectAttributes rttr, HttpSession session) {
		Integer comId = (Integer) session.getAttribute("comId");
		dto.setComId(comId);

		ProjectMemberDto member = memberservice.selectOne(dto.getPmId());
		if (member == null) {
			rttr.addFlashAttribute("result", "유효하지 않은 담당자입니다.");
			return "redirect:/proj/proj_detail?pro_id=" + dto.getProId();
		}

		String result = "태스크 등록 실패";
		try {
			if (dependencyService.insertWithParent(dto) > 0) {
				result = "태스크 등록 성공";
			}
		} catch (IllegalArgumentException | IllegalStateException e) {   // IllegalStateException 추가
			result = e.getMessage();
		}

		rttr.addFlashAttribute("result", result);
		return "redirect:/proj/proj_detail?pro_id=" + dto.getProId();
	}
	
	  @GetMapping("/task_detail") 
	 public String view(@RequestParam("task_id") int taskId,Model model) {
	 TaskDto dto = service.select(taskId);
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
	 public String taskEditView(@RequestParam("task_id") int taskId,@RequestParam("project_pro_id") int projectProId, Model model) {
		  model.addAttribute("dto",service.taskEditView(taskId));
		  model.addAttribute("memberlist",memberservice.selectByproject(projectProId));
		  model.addAttribute("pro_id",projectProId);
		  return "proj/task_edit";  }//태스크 수정뷰
		  
	  
	  @PostMapping("/task_edit")
	 public String edit(TaskDto dto,RedirectAttributes rttr) {
		  String result= "태스크 수정 실패";
		    try {
		        if(dependencyService.updateTaskSchedule(dto) > 0) { result = "태스크 수정 성공"; }
		    } catch(IllegalArgumentException e) { result = e.getMessage(); }
			rttr.addFlashAttribute("result",result);
			return "redirect:/proj/task_detail?task_id="+dto.getTaskId();
	  } //태스크 수정폼
	  
	  @GetMapping("/task_delete")
	  public String delete(@RequestParam("task_id") int taskId, @RequestParam("pro_id") int proId,RedirectAttributes rttr) {
		  String result="태스크 삭제 실패";
		  if(service.delete(taskId)>0) {result="태스크 삭제 성공";}
		  rttr.addFlashAttribute("result",result);
		  return "redirect:/proj/proj_detail?pro_id="+proId;
	  }// 태스크 삭제
	  
	  
	    @GetMapping("/task_list")
	    public String myList(TaskSearchDto search, Model model,Authentication auth) {
	    	CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
	    	int empId =user.getUser().getEmpId();
	    	int comId = user.getUser().getComId();
	    	
	    	   search.setEmpId(empId);
	    	   search.setComId(comId);

	        int totalCnt = service.selectMyTasksCount(search);
	        PagingUtil paging = new PagingUtil(totalCnt, search.getPstartno());
	        List<TaskDto> tasks = service.selectMyTasks(search);

	        for (TaskDto task : tasks) {
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
		public List<TaskDto> gantt(@RequestParam("pro_id") int proId){
			return dependencyService.selectTaskDependencies(proId);
		}
}
