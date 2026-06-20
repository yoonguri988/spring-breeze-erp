package com.sb.erp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sb.erp.dto.ApprFormDto;
import com.sb.erp.dto.ApprFormSearchDto;
import com.sb.erp.dto.CompanySearchDto;
import com.sb.erp.service.ApprService;

@Controller
public class ApprController {
	
	@Autowired ApprService appr;
	
	
	@RequestMapping( value = "/searchCompany", method = RequestMethod.GET)
	@ResponseBody
	public List<CompanySearchDto> searchCompany(@RequestParam("company") String company){
		return appr.searchCompany(company);
	}
	
	
	@RequestMapping( value = "/searchForms", method = RequestMethod.GET)
	@ResponseBody
	public List<ApprFormDto> searchForms(@RequestParam("keyword") String keyword,
										 @RequestParam("company") String comId,
										 @RequestParam( value = "forStatus", required = false) String status){
		ApprFormSearchDto dto = new ApprFormSearchDto();
		dto.setComId(
				(comId == null || comId.isBlank()) ?
				null : Integer.parseInt(comId)
				);
		dto.setForStatus(
				(status == null || status.isBlank()) ?
				null : Boolean.parseBoolean(status)
				);
		dto.setKeyword(keyword);
		
		//int totalCnt = appr.listFormCnt(dto);
		
		return appr.selectFormList(dto);
	}
	
	
	@RequestMapping( value = "/appr/write_form", method = RequestMethod.GET)
	public String writeForm() {
		return "appr/write_form";
	}
	
	
	@RequestMapping( value = "/appr/write_form", method = RequestMethod.POST)
	public String writeForm_post(ApprFormDto dto, RedirectAttributes rttr) {
		System.out.println("�젣紐� = " + dto.getForTitle());
		System.out.println("�궡�슜 = " + dto.getForContent());
		
		if(appr.insertForm(dto) > 0) {
			return "redirect:/appr/write_form";
		}
		return "appr/write_form";
	}
	
	
	@RequestMapping( value = "/appr/list_form", method = RequestMethod.GET)
	public String listForm() {
		return "appr/list_form";
	}
	
	
	@RequestMapping( value = "/appr/list_form", method = RequestMethod.POST)
	public String listForm_post() {
		return "appr/list_form";
	}
	
	
	@RequestMapping( value = "/appr/update_form", method = RequestMethod.GET)
	public String update(int forId, Model model) {
		model.addAttribute("dto", appr.selectFormAll(forId));
		return "appr/update_form";
	}
	
	
}
