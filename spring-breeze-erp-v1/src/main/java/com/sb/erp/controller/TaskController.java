package com.sb.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sb.erp.dto.ProjectMemberDto;
import com.sb.erp.dto.TaskDto;
import com.sb.erp.service.ProjectMemberService;
import com.sb.erp.service.TaskService;

@Controller
public class TaskController {
	@Autowired TaskService service;
	@Autowired ProjectMemberService memberservice;

	
	/*
	 * @RequestMapping(value = "/proj/task_list", method = RequestMethod.GET) public
	 * String taskList(int task_id, Model model) { model.addAttribute("list",
	 * service.selectAll(task_id)); model.addAttribute("task_id", task_id); return
	 * "proj/task_detail"; }// 해당 프로젝트-태스크 리스트
	 * 
	 * 
	 */
	/*
	 * @RequestMapping("/proj/task_create") public String list(@RequestParam int
	 * pro_project_id,Model model) { List<ProjectMemberDto>members =
	 * memberservice.selectByproject(pro_project_id);
	 * model.addAttribute("members",members);
	 * model.addAttribute("pro_project_id",pro_project_id); return
	 * "proj/task/create"; }
	 */
	
	/*
	 * @RequestMapping(value="/proj/task_create") public String list(@RequestParam
	 * int project_pro_id ,Model model) {
	 * model.addAttribute("memberlist",memberservice.selectByproject(project_pro_id)
	 * ); return "proj/task_create"; }   ?project_pro_id=3
	 */
	@RequestMapping(value="proj/task_create", method=RequestMethod.GET)
	public String createFrom(@RequestParam int project_pro_id, Model model) {
		System.out.println("..................."+memberservice.selectByproject(project_pro_id));
		
		model.addAttribute("memberlist",memberservice.selectByproject(project_pro_id));
		model.addAttribute("pro_id",project_pro_id);
		return "proj/task_create";
	}
	
	 @RequestMapping(value="proj/task_create", method=RequestMethod.POST) 
	 public String create(TaskDto dto) {
		 dto.setComId(1);
		 ProjectMemberDto member = memberservice.selectOne(dto.getPmId());
		 dto.setPmIdName(member.getEmpName());
	
		 service.insert(dto);
		 return "redirect:/proj/task_create?project_pro_id="+dto.getProId();
	 }
	
	  @RequestMapping(value="/proj/task_detail",method=RequestMethod.GET) 
	 public String view(int task_id,Model model) {
	 TaskDto dto = service.select(task_id);
	  model.addAttribute("dto",service.select(task_id));
	  model.addAttribute("pro_id", dto.getProId());
	  return "proj/task_detail";
	  } //해당 태스크 상세
	 	  
	 @RequestMapping(value="/proj/task_edit", method=RequestMethod.GET) 
	 public String taskEditView(int task_id,int project_pro_id, Model model) {
		  model.addAttribute("dto",service.taskEditView(task_id));
		  model.addAttribute("memberlist",memberservice.selectByproject(project_pro_id));
		  model.addAttribute("pro_id",project_pro_id);
		  return "proj/task_edit";  }//태스크 수정뷰
		  
	  
	  @RequestMapping(value="/proj/task_edit", method=RequestMethod.POST)
	 public String edit(TaskDto dto,RedirectAttributes rttr) {
		  String result= "수정실패";
		  if(service.update(dto)>0) {result="수정성공";}
			rttr.addFlashAttribute("result",result);
			return "redirect:/proj/task_detail?task_id="+dto.getTaskId();
	  }
	  
	  @RequestMapping(value="/proj/task_delete", method=RequestMethod.GET)
	  public String delete(int task_id, @RequestParam("pro_id")int pro_id) {
		  service.delete(task_id);
		  return "redirect:/proj/proj_detail?pro_id="+pro_id;
	  }
}
