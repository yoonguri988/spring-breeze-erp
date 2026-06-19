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
import com.sb.erp.service.ProjectMemberService;
import com.sb.erp.service.ProjectService;
import com.sb.erp.service.TaskService;
import com.sb.erp.util.PagingUtil;


@Controller
public class ProjectController {
	@Autowired ProjectService service;
	@Autowired TaskService taskService;
	@Autowired ProjectMemberService memberService;
	
	@RequestMapping(value="/proj/period", method=RequestMethod.GET)
	public String selectByPeriod(String startDate, String endDate, Model model) {
	    model.addAttribute("list", service.selectByPeriod(startDate, endDate));
	    return "proj/proj_list";
	}//기간조회
	
	@RequestMapping(value="/proj/proj_list" , method=RequestMethod.GET) //전체출력시
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
	
	
	@RequestMapping(value="/proj/proj_create", method=RequestMethod.POST)
	public String insert_post(ProjectDto dto, HttpSession session) { //등록처리
		
		/*
		 	dto.setEmpId((Integer)session.getAttribute("emp_id"));
    		dto.setComId((Integer)session.getAttribute("com_id"));
    		 Integer empId = (Integer) session.getAttribute("emp_id");
    		 Integer comId = (Integer) session.getAttribute("com_id");
		 */
		dto.setComId(1);
		dto.setEmpId(1);
	   service.insert(dto);
	  return "redirect:/proj/proj_list";
	}
	
	@RequestMapping(value="/proj/proj_detail", method=RequestMethod.GET)
	public String select(int pro_id, Model model) { //상세
		model.addAttribute("dto",service.select(pro_id)); //프로젝트 상세조회
		model.addAttribute("list", taskService.selectAll(pro_id)); //해당 태스크 리스트
		model.addAttribute("memberList", memberService.select(pro_id)); //머더라 그 머더라..그.. 멤버출력
		return "proj/proj_detail";
	}
	
	@RequestMapping(value="/proj/proj_edit", method = RequestMethod.GET)
	public String editView(int pro_id, Model model) { //수정뷰
		model.addAttribute("dto", service.editView(pro_id));
		return "proj/proj_edit";
	}
	
	@RequestMapping(value="/proj/proj_edit", method=RequestMethod.POST)
	public String edit_post(ProjectDto dto,RedirectAttributes rttr) { //수정처리
		String result="수정실패";
		if(service.edit(dto)>0) {result="수정성공";}
		rttr.addFlashAttribute("result",result);
		return "redirect:/proj/proj_detail?pro_id="+dto.getProId();
	}
	
	@RequestMapping(value="/proj/delete", method=RequestMethod.GET) //삭제
	public String delete(int pro_id) {
		service.delete(pro_id);
		return "redirect:/proj/proj_list";
	}
	

	
}
