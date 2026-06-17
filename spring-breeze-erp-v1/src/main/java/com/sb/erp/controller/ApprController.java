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
	
	// 양식 작성 폼 !권한 부여해야함 관리자 파트임!
	@RequestMapping( value = "/appr/write_form", method = RequestMethod.GET)
	public String writeForm() {
		return "appr/write_form";
	}
	
	// 양식 작성 처리 !권한 부여해야함 관리자 파트임!
	@RequestMapping( value = "/appr/write_form", method = RequestMethod.POST)
	public String writeForm_post(ApprFormDto dto, RedirectAttributes rttr) {
		System.out.println("제목 = " + dto.getForTitle());
		System.out.println("내용 = " + dto.getForContent());
		
		if(appr.insertForm(dto) > 0) {
			return "redirect:/appr/write_form";
		}
		return "appr/write_form";
	}
	
	// 양식 리스트 폼 !권한!
	@RequestMapping( value = "/appr/list_form", method = RequestMethod.GET)
	public String listForm() {
		return "appr/list_form";
	}
	
	// 일단 만들어는 놨는데 이후 필요없을거같으면 지울예정
	@RequestMapping( value = "/appr/list_form", method = RequestMethod.POST)
	public String listForm_post() {
		return "appr/list_form";
	}
	
	// 양식 수정 폼
	@RequestMapping( value = "/appr/update_form", method = RequestMethod.GET)
	public String update(int forId, Model model) {
		model.addAttribute("dto", appr.selectFormAll(forId));
		return "appr/update_form";
	}
	
	
}
