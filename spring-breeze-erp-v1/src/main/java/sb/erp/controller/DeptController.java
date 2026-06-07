package sb.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import sb.erp.dto.DeptDto;
import sb.erp.service.DeptService;

@Controller
public class DeptController {
	@Autowired DeptService service;
	
	@RequestMapping("/")
	public String index() {
		return "redirect:/dept/tree.do?companyId=1";
	}
	
	// 조직도 조회
	@RequestMapping(value="/dept/tree.do", method=RequestMethod.GET)
	public String orgTree(int companyId, Model model) {
		model.addAttribute("items", service.selectOrgTree(companyId));
		model.addAttribute("companyId", companyId);
		return "/dept/orgChart";
	}
	
	@RequestMapping(value="/dept/add.do", method=RequestMethod.GET)
	public String addForm(int companyId, Model model) {
		model.addAttribute("items", service.selectOrgTree(companyId));
		model.addAttribute("companyId", companyId);
		return "/dept/deptForm";
	}
	
	@RequestMapping(value="/dept/add.do", method=RequestMethod.POST)
	public String addForm_post(DeptDto dto) {
		String msg = "등록 처리에 실패하였습니다";
		if(service.insert(dto) > 0) { msg = "등록 처리에 성공하였습니다."; }
		return "redirect:/dept/tree.do?companyId=1";
	}
}
