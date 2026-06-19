package com.sb.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sb.erp.dto.CompanyDto;
import com.sb.erp.dto.DeptDto;
import com.sb.erp.dto.StatsDeptDto;
import com.sb.erp.service.CompanyService;
import com.sb.erp.service.DeptService;
import com.sb.erp.service.EmpService;

@Controller
public class DeptController {
	@Autowired DeptService service;
	@Autowired CompanyService comService;
	@Autowired EmpService empService;
	
	// 부서 목록 
	@RequestMapping(value="/dept/list", method=RequestMethod.GET)
	public String orgTree(@RequestParam("comId") int comId, Model model) {
		CompanyDto com = comService.selectOneById(comId);
		
		// 통계데이터
		StatsDeptDto stats = service.selecStats(comId);
		
		model.addAttribute("stats", stats);
		model.addAttribute("com", com);
		model.addAttribute("items", service.selectOrgTree(comId));
		return "/dept/list";
	}
	
	// 부서 등록 폼
	@RequestMapping(value="/dept/add", method=RequestMethod.GET)
	public String addForm(@RequestParam("comId") int comId, Model model) {
		CompanyDto com = comService.selectOneById(comId);
		model.addAttribute("deptList", service.selectOrgTree(comId));
		model.addAttribute("com", com);
		return "/dept/add";
	}
	
	// 부서 등록 기능
	@RequestMapping(value="/dept/add", method=RequestMethod.POST)
	public String addForm_post(@RequestParam("comId") int comId, DeptDto dto, RedirectAttributes rttr) {
		String msg = "부서 등록에 성공하였습니다.";
		if(service.insert(dto) > 0) { msg = "부서등록에 실패하였습니다."; }
		rttr.addFlashAttribute("msg", msg);
		return "redirect:/dept/list?comId="+comId;
	}
	
	// 부서 수정 폼
	@RequestMapping(value="/dept/edit", method=RequestMethod.GET)
	public String editForm(
			@RequestParam("deptId") int deptId, 
			@RequestParam("comId") int comId, 
			Model model) {
		CompanyDto com = comService.selectOneById(comId);
		DeptDto dept = service.selectOneById(deptId);
		
		model.addAttribute("dept", dept);
		model.addAttribute("deptList", service.selectOrgTree(dept.getComId()));
		model.addAttribute("com", com);
		model.addAttribute("empList", empService.selectByDeptId(deptId));
		model.addAttribute("deptEmpList", empService.selectByDeptId(deptId));
		return "/dept/edit";
	}
	
	// 부서 수정 기능
	@RequestMapping(value="/dept/edit", method=RequestMethod.POST)
	public String editForm_post(int deptId, DeptDto dto, RedirectAttributes rttr) {
		DeptDto se = service.selectOneById(deptId);
		try {
			service.update(dto);
			rttr.addFlashAttribute("msg", "부서 수정 성공.");
		} catch (IllegalStateException e) {
			rttr.addFlashAttribute("msg", e.getMessage());
		}
		return "redirect:/dept/list?comId="+se.getComId();
	}
	
	//부서 삭제 기능
	@RequestMapping(value="/dept/delete", method=RequestMethod.POST)
	public String delete_post(int deptId, RedirectAttributes rttr) {
		DeptDto dto = service.selectOneById(deptId);
		try {
			service.delete(deptId);
			rttr.addFlashAttribute("msg", "부서 삭제 성공.");
		} catch (IllegalStateException e) {
			rttr.addFlashAttribute("msg", e.getMessage());
		}
		return "redirect:/dept/list?comId="+dto.getComId();
	}
}
