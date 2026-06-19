package com.sb.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.sb.erp.dto.ProjectMemberDto;
import com.sb.erp.service.ProjectMemberService;
import com.sb.erp.service.ProjectService;

@Controller
public class ProjectMemberController {
	@Autowired ProjectMemberService service;
	
	
	@RequestMapping(value="/proj/proj_member" ,method=RequestMethod.GET)
	public String list(int pro_id, Model model) {
		 model.addAttribute("list", service.select(pro_id));
		 model.addAttribute("pro_id", pro_id);
		return "proj/proj_member";} //프로젝트 참여인원 조회
	
	  @RequestMapping(value="/proj/proj_member_create",method=RequestMethod.POST) 
	  public String insert(ProjectMemberDto dto) { 
		  service.insert(dto); 
		  return "redirect:/proj/proj_member?pro_id="+dto.getProjectProId(); } //프로젝트 멤버 추가
	 
	
	@RequestMapping(value="/proj/proj_member_delete",method=RequestMethod.GET) 
	public String delete(@RequestParam("pm_id")int pm_id, @RequestParam("pro_id") int pro_id ) {
		service.delete(pm_id);
		return "redirect:/proj/proj_member?pro_id="+pro_id;}//프로젝트 멤버 삭제

}
