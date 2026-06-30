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
import com.sb.erp.service.EmpService;
import com.sb.erp.service.ProjectMemberService;
import com.sb.erp.service.TaskService;

import jakarta.servlet.http.HttpSession;

@Controller
public class TaskController {
	@Autowired TaskService service;
	@Autowired ProjectMemberService memberservice;
	@Autowired EmpService empservice;

	@RequestMapping(value="/proj/task_create", method=RequestMethod.GET)
	public String createFrom(@RequestParam int project_pro_id, Model model) {
		model.addAttribute("memberlist",memberservice.selectByproject(project_pro_id));
		model.addAttribute("pro_id",project_pro_id);
		return "proj/task_create"; // 프로젝트 멤버 이름 출력
	}
	
	 @RequestMapping(value="/proj/task_create", method=RequestMethod.POST) 
	 public String create(TaskDto dto,RedirectAttributes rttr, HttpSession session) {
		 Integer comId = (Integer) session.getAttribute("comId");
		 dto.setComId(comId); //해당회사의
		 ProjectMemberDto member = memberservice.selectOne(dto.getPmId());
		 if (member == null) { //방어코드
			 rttr.addFlashAttribute("result", "유효하지 않은 담당자입니다.");
			 return "redirect:/proj/proj_detail?pro_id=" + dto.getProId();
		 }
		 
		 dto.setPmIdName(member.getEmpName());
		 
		 String result="태스크 등록 실패";
		 if(service.insert(dto)>0) {result="태스크 등록 성공";}
		 rttr.addFlashAttribute("result",result);
		 return "redirect:/proj/proj_detail?pro_id="+dto.getProId();
	 	} // 태스크 등록
	
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
		  String result= "태스크 수정 실패";
		  if(service.update(dto)>0) {result="태스크 수정 성공";}
			rttr.addFlashAttribute("result",result);
			return "redirect:/proj/task_detail?task_id="+dto.getTaskId();
	  } //태스크 수정폼
	  
	  @RequestMapping(value="/proj/task_delete", method=RequestMethod.GET)
	  public String delete(int task_id, @RequestParam("pro_id")int pro_id,RedirectAttributes rttr) {
		  String result="태스크 삭제 실패";
		  if(service.delete(task_id)>0) {result="태스크 삭제 성공";}
		  rttr.addFlashAttribute("result",result);
		  return "redirect:/proj/proj_detail?pro_id="+pro_id;
	  }// 태스크 삭제
}
