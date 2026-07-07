package com.sb.erp.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sb.erp.dto.ApprDocDto;
import com.sb.erp.dto.ApprDocInitResponseDto;
import com.sb.erp.dto.ApprFormDto;
import com.sb.erp.service.ApprDocService;

@Controller
public class ApprDocController {
	
	@Autowired ApprDocService service;
	
	
	//////////////////////////// 문서 작성 처리 파트 /////////////////////////////
	
	// 해당 회사에 있는 활성화된 양식 가져오기
	@GetMapping("/getFormList")
	@ResponseBody
	public List<ApprFormDto> getFormList(@RequestParam("comId") int comId){
		ApprDocDto dto = new ApprDocDto();
		dto.setComId(comId);
		return service.findForm(dto);
	}
	
	// 문서 작성시 
	@GetMapping("/getFormDetail")
	@ResponseBody
	public ApprFormDto getFormDetail(@RequestParam("forId") int forId,
							   		 @RequestParam("forVersion") int forVersion) {
		Map<String, Object> params = new HashMap<>();
		params.put("forId", forId);
		params.put("forVersion", forVersion);
		
		return service.getForm(params);
	}
	
	
	@GetMapping("/appr/write_doc")
	public String writeDoc(Model model, Principal principal) {
		ApprDocDto dto = new ApprDocDto();
		dto.setEmpId(1);
		ApprDocInitResponseDto result = service.initResponse(dto);
		
		model.addAttribute("dto", result);
		return "appr/write_doc";
	}
	
	////////////////////////////문서 작성 처리 파트 /////////////////////////////
	
	////////////////////////////문서 조회 처리 파트 /////////////////////////////
	
	@GetMapping("/appr/list_doc")
	public String listDoc(Model model) {
		
		// 로그인 유저 정보 가져오기 (emp_id)
		ApprDocDto dto = new ApprDocDto(); 
		dto.setEmpId(41); // 일단 임시값으로 넣음
		
		// 각각 구성 넣어 보내기
		Map<String, Object> docCnts = service.selectDocCnt(dto);
		List<Map<String, Object>> hisDocs = service.selectMyHistoryDocs(dto);
		List<Map<String, Object>> todoDocs = service.selectMyTodoDocs(dto);
		
		model.addAttribute("docCnts", docCnts);
		model.addAttribute("hisDocs", hisDocs);
		model.addAttribute("todoDocs", todoDocs);
		
		return "appr/list_doc";
	}
	
	////////////////////////////문서 조회 처리 파트 /////////////////////////////
	
}
