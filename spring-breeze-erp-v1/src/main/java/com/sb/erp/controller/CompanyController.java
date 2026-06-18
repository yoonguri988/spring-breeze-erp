package com.sb.erp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sb.erp.dto.ComSearchDto;
import com.sb.erp.dto.CompanyDto;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.PermDto;
import com.sb.erp.service.CompanyService;
import com.sb.erp.service.EmpService;
import com.sb.erp.service.PermService;
import com.sb.erp.util.PagingUtil;

@Controller
public class CompanyController {
	@Autowired CompanyService service;
	@Autowired EmpService empService;
	@Autowired PermService permService;
	
	// 회사 등록
	@RequestMapping(value="/com/add", method= RequestMethod.GET)
	public String addForm() {
		return "/com/form";
	}
	
	//회사 등록 기능
	@RequestMapping(value="/com/add", method= RequestMethod.POST)
	public String add(CompanyDto dto, RedirectAttributes rttr) {
		String msg = "회사 등록에 실패하였습니다.";
		if(service.add(dto) > 0) { msg = "회사 등록에 성공하셨습니다."; }
		rttr.addFlashAttribute("msg", msg);
	    return "redirect:/com/list";
	}
	
	// 회사 사업자 번호 중복 체크 (ajax)
	@RequestMapping(value="/com/checkBizNo", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> checkBizNo(String bizNo){
		Map<String, Object> res = new HashMap<>();
		CompanyDto dto = service.isDuplicateBizNo(bizNo);
		
		if(dto != null) res.put("duplicate", true);
		else res.put("duplicate", false);
		
		return res;
	}
	
	// 회사 목록 조회
	@RequestMapping(value="/com/list", method= RequestMethod.GET)
	public String list(ComSearchDto search, Model model) {
		int listtotal = service.listTotal(search);
		PagingUtil paging = new PagingUtil(listtotal, search.getOnepagelist(), search.getPstarValue());
		model.addAttribute("paging", paging);
		model.addAttribute("items", service.list(search));
		return "/com/list";
	}
	
	// 검색 조회 목록 상위 5개 (ajax)
	@RequestMapping(value="/com/suggest", method=RequestMethod.GET)
	@ResponseBody
	public List<CompanyDto> suggest(@RequestParam("keyword") String keyword) {
	    return service.getSuggest(keyword);
	}
	
	// 회사 수정 폼
	@RequestMapping(value="/com/edit", method = RequestMethod.GET)
	public String editForm(int comId, Model model) {
		model.addAttribute("com", service.selectOneById(comId));
		return "/com/edit";
	}
	
	// 회사 수정 기능
	@RequestMapping(value="/com/edit", method = RequestMethod.POST)
	public String edit(CompanyDto dto, RedirectAttributes rttr) {
		String msg = "회사 정보 수정에 실패 하였습니다.";
		if(service.update(dto) > 0) { msg = "회사 정보 수정에 성공하셨습니다.";}
		rttr.addFlashAttribute("msg", msg);
		return "redirect:/com/list";
	}
	
	// 회사 삭제 폼
	@RequestMapping(value="/com/delete", method = RequestMethod.GET)
	public String deleteModal(@RequestParam("comId") Integer comId, Model model) {
	    CompanyDto dto = service.selectOneById(comId);
	    model.addAttribute("com", dto);
		return "/com/delModal";
	}
	
	// 회사 삭제 기능
	@RequestMapping(value="/com/delete", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> delete(Authentication auth, EmpDto dto) {
	    Map<String, Object> result = new HashMap<>();
	    
	    EmpDto emp = empService.selectByEmpEmail(auth.getName());
	    //1. 로그인한 사용자가 관리자가 아닌 경우
	    //1-1. 로그인사용자가 ROOT(시스템관리자) 인가?
	    PermDto root = permService.selectByEmpId(emp.getEmpId());
	    
	    // ROOT(시스템 관리자) 아닌 경우
	    if(!root.getAutName().equals("ROOT")) {
	        throw new IllegalStateException("시스템 관리자 외에는 회사를 삭제할 수 없습니다.");
	    }

	    //2. 관리자가 입력한 비밀번호가 일치 하지 않을 경우
	    dto.setEmpId(emp.getEmpId());
	    boolean matched = empService.matchPassword(dto);
	    if (!matched) {
	        result.put("success", false);
	        result.put("message", "비밀번호가 올바르지 않습니다.");
	        return result;
	    }

	    service.delete(dto.getComId());
	    result.put("success", true);
	    return result;
	}
	
	//관리자 - 회사 목록 조회
	@RequestMapping(value="/admin/com/list", method= RequestMethod.GET)
	public String list_admin(ComSearchDto search, Model model) {
		int listtotal = service.listTotal(search);
		PagingUtil paging = new PagingUtil(listtotal, search.getOnepagelist(), search.getPstarValue());
		model.addAttribute("paging", paging);
		model.addAttribute("items", service.list(search));
		return "/com/list";
	}
}