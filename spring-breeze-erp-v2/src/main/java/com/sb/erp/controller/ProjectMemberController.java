package com.sb.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sb.erp.dto.ProjectMemberDto;
import com.sb.erp.service.ProjectMemberService;

@Controller
@RequestMapping("/proj")
public class ProjectMemberController {
	@Autowired ProjectMemberService service;
	
	
	@GetMapping("/proj_member")
	public String list(int pro_id, Model model) {
		 model.addAttribute("list", service.select(pro_id));
		 model.addAttribute("pro_id", pro_id);
		return "proj/proj_member";} //프로젝트 참여인원 조회
	
	  @PostMapping("/proj_member_create") 
	  public String insert(ProjectMemberDto dto,RedirectAttributes rttr) { 
		  String result="프로젝트 멤버 추가 실패";
		  if(service.insert(dto)>0) {result="프로젝트 멤버 추가 성공";}
		  rttr.addFlashAttribute("result",result);
		  return "redirect:/proj/proj_member?pro_id="+dto.getProjectProId(); } //프로젝트 멤버 추가
	 
	
	@GetMapping("/proj_member_delete") 
	public String delete(@RequestParam("pm_id")int pm_id, @RequestParam("pro_id") int pro_id,
			RedirectAttributes rttr) {
		String result="프로젝트 멤버 삭제 실패";
		if(service.delete(pm_id)>0) {result="프로젝트 멤버 삭제 성공";}
		rttr.addFlashAttribute("result",result);
		return "redirect:/proj/proj_member?pro_id="+pro_id;}//프로젝트 멤버 삭제

}
