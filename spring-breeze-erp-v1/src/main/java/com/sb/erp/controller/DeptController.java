package com.sb.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sb.erp.dto.DeptDto;
import com.sb.erp.service.DeptService;

@Controller
public class DeptController {
	@Autowired DeptService service;
	
	// 부서 목록 
	@RequestMapping(value="/dept/list", method=RequestMethod.GET)
	public String orgTree(@RequestParam("comId") int comId, Model model) {
		model.addAttribute("items", service.selectOrgTree(comId));
		model.addAttribute("comId", comId);
		return "/dept/list";
	}
	
	// 부서 등록 폼
	@RequestMapping(value="/dept/add", method=RequestMethod.GET)
	public String addForm(@RequestParam("comId") int comId, Model model) {
		model.addAttribute("deptList", service.flattenOrgTree(comId));
		model.addAttribute("comId", comId);
		return "/dept/addForm";
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
	public String editForm(@RequestParam("deptId") int deptId, Model model) {
		DeptDto dept = service.selectOneById(deptId);
		model.addAttribute("dept", dept);
		model.addAttribute("deptList", service.flattenOrgTree(dept.getComId()));
		model.addAttribute("comId", dept.getComId());
		return "/dept/editForm";
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
