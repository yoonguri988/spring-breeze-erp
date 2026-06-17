package com.sb.erp.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sb.erp.dto.ProjectDto;
import com.sb.erp.service.ProjectService;
import com.sb.erp.util.PagingUtil;


@Controller
public class ProjectController {
	@Autowired ProjectService service;
	
	/*
	 * @RequestMapping(value="/proj/proj_list.do", method=RequestMethod.GET) public
	 * String list() { return "proj/proj_list"; }
	 */
	
	@RequestMapping(value="/proj/proj_list.do" , method=RequestMethod.GET) //전체출력시
	public String listselect(Model model, @RequestParam(value="pstartno", defaultValue = "1")int pstartno) {
		model.addAttribute("paging", new PagingUtil(service.selectCnt(),pstartno));
		model.addAttribute("list", service.select10(pstartno));
		return "proj/proj_list";}
	
	@RequestMapping(value="/proj/status", method=RequestMethod.GET) //상태별조회
	public String selectByStatus(String pro_status, Model model) {
		model.addAttribute("list",service.selectByStatus(pro_status));
		return "proj/proj_list";
	}
	
	@RequestMapping(value="/proj/proj_create",method=RequestMethod.GET)
	public String insert() {return "proj/proj_create";} //등록
	
	
	@RequestMapping(value="/proj/proj_create.do", method=RequestMethod.POST)
	public String insert_post(ProjectDto dto, HttpSession session) { //등록처리
		
		/*
		 * dto.setEmp_id(.getEmp_id)); dto.setCom_id(.getCom_id)); 
		 */
		
	   service.insert(dto);
	  return "redirect:/proj/proj_list.do";
	}
	
	@RequestMapping(value="/proj/proj_detail.do", method=RequestMethod.GET)
	public String select(int pro_id, Model model) { //상세
		model.addAttribute("dto",service.select(pro_id));
		return "proj/proj_detail";
	}
	
	@RequestMapping(value="/proj/proj_edit.do", method = RequestMethod.GET)
	public String editView(int pro_id, Model model) { //수정뷰
		model.addAttribute("dto", service.editView(pro_id));
		return "proj/proj_edit";
	}
	
	@RequestMapping(value="/proj/proj_edit.do", method=RequestMethod.POST)
	public String edit_post(ProjectDto dto,RedirectAttributes rttr) { //수정처리
		String result="수정실패";
		if(service.edit(dto)>0) {result="수정성공";}
		rttr.addFlashAttribute("result",result);
		return "redirect:/proj/proj_detail.do?pro_id="+dto.getPro_id();
	}
	
	@RequestMapping(value="/proj/delete.do", method=RequestMethod.GET) //삭제
	public String delete(int pro_id) {
		service.delete(pro_id);
		return "redirect:/proj/proj_list.do";
	}
	

	
}
