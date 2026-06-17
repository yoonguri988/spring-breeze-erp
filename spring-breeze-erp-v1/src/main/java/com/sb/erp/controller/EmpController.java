package com.sb.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.EmpSearchDto;
import com.sb.erp.service.DeptService;
import com.sb.erp.service.EmpService;
import com.sb.erp.service.PosService;

@Controller
public class EmpController {

	@Autowired
	EmpService empService;
	@Autowired
	PosService posService;
	@Autowired
	DeptService deptService;

	// 조회 목록
	@RequestMapping("/emp/list")
	public String list(EmpSearchDto search, @RequestParam(value = "searched", required = false) String searched,
			Model model) {

		if (searched != null) {
			model.addAttribute("empList", empService.search(search));
		}

		// 사용자가 입력한 검색 조건(폼 value 이용)
		model.addAttribute("search", search);

		// 드롭다운은 model에
		model.addAttribute("posList", posService.selectAll());
		model.addAttribute("deptList", deptService.selectAll());
		return "emp/list";
	}

	// 상세페이지
	@RequestMapping("/emp/detail")
	public String detail(@RequestParam int empId, Model model) {
		EmpDto emp = empService.selectByEmpId(empId);
		model.addAttribute("emp", emp);
		return "emp/detail";
	}

	// 사원 등록 get
	@RequestMapping(value="/emp/add" , method=RequestMethod.GET)
	public String addEmp(Model model) {

		// 부서 및 직급 드롭다운 옵션
		model.addAttribute("posList", posService.selectAll());
		model.addAttribute("deptList", deptService.selectAll());
		return "emp/add";
	}

	// 사원 등록 post
	@RequestMapping(value="/emp/add" , method=RequestMethod.POST)
	public String addEmpPost(EmpDto dto) {

		empService.insert(dto);
		return "redirect:/emp/list";
	}
	
	//사원 수정
	@RequestMapping(value="/emp/edit" , method=RequestMethod.GET)
	public String editForm(@RequestParam int empId, Model model) {
	    // 1. ??? — 어떤 사원의 수정 폼인지
		model.addAttribute("emp", empService.selectByEmpId(empId));
		// 부서 및 직급 드롭다운 옵션
		model.addAttribute("posList", posService.selectAll());
		model.addAttribute("deptList", deptService.selectAll());
	    return "emp/edit";
	}

	@RequestMapping(value="/emp/edit" , method=RequestMethod.POST)
	public String editProcess(EmpDto dto) {
	    empService.update(dto);
	    return "redirect:/emp/detail?empId="+ dto.getEmpId(); 
	}
	

}