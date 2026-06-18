package com.sb.erp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.EmpSearchDto;
import com.sb.erp.service.DeptService;
import com.sb.erp.service.EmpService;
import com.sb.erp.service.PosService;
import com.sb.erp.util.PagingUtil;

@Controller
public class EmpController {

	@Autowired EmpService empService;
	@Autowired PosService posService;
	@Autowired DeptService deptService;

	// 조회 목록 + 페이징 유틸 이용하기
	@RequestMapping("/emp/list")
	public String list(EmpSearchDto search, 
			@RequestParam(value = "searched", required = false) String searched,
			Model model) {

		if (searched != null) {
			
			// search에 페이지 기능을 병합해야함...
			// 현재 페이지/검색 결과가 없으면 1로 고정
			int currentPage = (search.getPage() == null) ? 1 : search.getPage();
			
			// 전체, 검색 결과 갯수 cnt(*)
			int total = empService.selectCnt(search);
			
			PagingUtil paging = new PagingUtil(total, currentPage);
			
			// searchDto에 limit 값 넣기
			search.setPstartno(paging.getPstartno());
			search.setOnepagelist(paging.getOnepagelist());
			List<EmpDto> empList = empService.search(search);
						
			model.addAttribute("empList", empList);
			model.addAttribute("paging", paging);
		}

		// 사용자가 입력한 검색 조건(폼 value 이용)
		model.addAttribute("search", search);

		// 부서 및 직급
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

		// 부서 및 직급
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
	    
		model.addAttribute("emp", empService.selectByEmpId(empId));
		
		model.addAttribute("posList", posService.selectAll());
		model.addAttribute("deptList", deptService.selectAll());
	    return "emp/edit";
	}

	@RequestMapping(value="/emp/edit" , method=RequestMethod.POST)
	public String editProcess(EmpDto dto) {
	    empService.update(dto);
	    return "redirect:/emp/detail?empId="+ dto.getEmpId(); 
	}
	
	
	// 이메일 중복 검사
	@RequestMapping(value="/emp/checkEmail", method=RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> checkEmail(@RequestParam String empEmail) {
	    boolean duplicate = empService.isEmailDuplicate(empEmail);
	    Map<String, Object> result = new HashMap<>();
	    result.put("duplicate", duplicate);
	    return result;
	}
}