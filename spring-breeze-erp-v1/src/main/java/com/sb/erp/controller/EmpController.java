package com.sb.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.EmpSearchDto;
import com.sb.erp.service.DeptService;
import com.sb.erp.service.EmpService;
import com.sb.erp.service.PosService;

@Controller
public class EmpController {
	
	@Autowired EmpService empService;
	@Autowired PosService posService;
	@Autowired DeptService deptService;
	
	// 조회 목록	
	@RequestMapping("/emp/list")
		public String list(
				EmpSearchDto search,
				@RequestParam(required = false) String searched,
				Model model) {  
		
			if(searched != null) {
				model.addAttribute("empList", empService.search(search));
			}
			
			// 사용자가 입력한 검색 조건(폼 value 이용)
			model.addAttribute("search", search);
						
			//드롭다운은 model에
			model.addAttribute("posList", posService.selectAll());
			model.addAttribute("deptList", deptService.selectAll());
			return  "emp/list";   
		}
	
	// 상세페이지
	@RequestMapping("/emp/detail")
		public String detail(@RequestParam int empId, Model model) {
		EmpDto emp = empService.selectByEmpId(empId);
		model.addAttribute("emp", emp);		
		return "emp/detail";
	}
}
