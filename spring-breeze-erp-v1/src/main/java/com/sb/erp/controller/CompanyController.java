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
	public List<CompanyDto> checkBizNo(String bizNo){
		CompanyDto dto = service.isDuplicateBizNo(bizNo);
		List<CompanyDto> dtoList = new ArrayList<>();
		dtoList.add(dto);
		return dtoList;
	}
	
	// 회사 목록 조회
	@RequestMapping(value="/com/list", method= RequestMethod.GET)
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
	
	// 회사 삭제 기능
	@RequestMapping(value="/com/delete.do", method = RequestMethod.GET)
	public String delete(int comId, RedirectAttributes rttr) {
		String msg = "회사 정보 삭제에 실패 하였습니다.";
		try {
			if(service.delete(comId) > 0) { msg ="회사 정보 삭제에 성공하셨습니다.";}
			rttr.addFlashAttribute("msg", msg);
		} catch (IllegalArgumentException e) {
			rttr.addFlashAttribute("msg", e.getMessage());
		}
		return "redirect:/com/list";
	}
	
	
}