package com.sb.erp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sb.erp.dto.ApprFormDto;
import com.sb.erp.dto.CompanySearchDto;
import com.sb.erp.service.ApprService;

@Controller
public class ApprController {
	
	@Autowired ApprService appr;
	
	// 입력한 회사 찾기
	@RequestMapping( value = "/searchCompany", method = RequestMethod.GET)
	@ResponseBody
	public List<CompanySearchDto> searchCompany(@RequestParam("company") String company){
		return appr.searchCompany(company);
	}
	
	// 양식 리스트 입력한 값 찾기
	@RequestMapping( value = "/searchForms", method = RequestMethod.GET)
	@ResponseBody
	public List<ApprFormDto> searchForms(@RequestParam("keyword") String keyword,
										 @RequestParam("company") String comId,
										 @RequestParam("forStatus") String status){
		return "";
	}
	
	// 양식 작성 폼 !권한 부여해야함 관리자 파트임!
	@RequestMapping( value = "/appr/write_form", method = RequestMethod.GET)
	public String writForm() {
		return "appr/write_form";
	}
	// 양식 작성 처리 !권한 부여해야함 관리자 파트임!
	@RequestMapping( value = "/appr/write_form", method = RequestMethod.POST)
	public String writForm_post(ApprFormDto dto, RedirectAttributes rttr) {
		if(appr.insertForm(dto) > 0) {
			return "redirect:/appr/write_form";
		}
		return "appr/write_form";
	}
	
}
