package com.sb.erp.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sb.erp.dto.CompanyDto;
import com.sb.erp.service.CompanyService;

import com.sb.erp.util.PagingUtil;

@Controller
public class CompanyController {
	@Autowired CompanyService service;
	
	@RequestMapping("/")
	public String index() {
		return "redirect:/com/list.do";
	}
	
	// 등록 폼
	@RequestMapping(value="/com/add.do", method= RequestMethod.GET)
	public String addForm() {
		return "/com/form";
	}
	
	// 등록 처리
	@RequestMapping(value="/com/add.do", method= RequestMethod.POST)
	public String add(CompanyDto dto, RedirectAttributes rttr) {
		String msg = "회사 등록에 실패하였습니다.";
		if(service.add(dto) > 0) { msg = "회사 등록에 성공하였습니다."; }
		rttr.addFlashAttribute("msg", msg);
	    return "redirect:/com/list.do";
	}
	
	//사업자번호 중복 체크 (ajax)
	@RequestMapping(value="/com/checkBizNo.do", method = RequestMethod.GET)
	@ResponseBody
	public List<CompanyDto> checkBizNo(String bizNo){
		CompanyDto dto = service.isDuplicateBizNo(bizNo);
		List<CompanyDto> dtoList = new ArrayList<>();
		dtoList.add(dto);
		return dtoList;
	}
	
	// 회사 목록 조회
	@RequestMapping(value="/com/list.do", method= RequestMethod.GET)
	public String list(@RequestParam(value="keyword", defaultValue = "")String keyword,
			@RequestParam(value="pstartno", defaultValue = "1") int pstarValue,
			@RequestParam(value="onepagelist", defaultValue = "10") int onepagelist,
			Model model) {
		int listtotal = service.listTotal(keyword);
		PagingUtil paging = new PagingUtil(listtotal, onepagelist, pstarValue);
		model.addAttribute("paging", paging);
		model.addAttribute("items", service.list(keyword, onepagelist, pstarValue));
		return "/com/list";
	}
	
	//
	@RequestMapping(value="/com/suggest.do", method=RequestMethod.GET)
	@ResponseBody
	public List<CompanyDto> suggest(@RequestParam("keyword") String keyword) {
	    return service.getSuggest(keyword); // 최대 5건
	}
	
	// 수정 폼
	@RequestMapping(value="/com/edit.do", method = RequestMethod.GET)
	public String editForm(int companyId, Model model) {
		model.addAttribute("com", service.selectOneById(companyId));
		return "/com/edit";
	}
	
	// 수정 처리
	@RequestMapping(value="/com/edit.do", method = RequestMethod.POST)
	public String edit(CompanyDto dto, RedirectAttributes rttr) {
		String msg = "회사 정보 수정에 실패하였습니다.";
		if(service.update(dto) > 0) { msg = "회사 정보가 수정되었습니다.";}
		rttr.addFlashAttribute("msg", msg);
		return "redirect:/com/list.do";
	}
	
	// 삭제 처리
	@RequestMapping(value="/com/delete.do", method = RequestMethod.GET)
	public String delete(int companyId, RedirectAttributes rttr) {
		String msg = "삭제에 실패하였습니다.";
		try {
			if(service.delete(companyId) > 0) { msg ="삭제 되었습니다.";}
			rttr.addFlashAttribute("msg", msg);
		} catch (IllegalArgumentException e) {
			rttr.addFlashAttribute("msg", e.getMessage());
		}
		return "redirect:/com/list.do";
	}
	
	
}
