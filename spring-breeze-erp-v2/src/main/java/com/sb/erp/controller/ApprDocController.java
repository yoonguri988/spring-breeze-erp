package com.sb.erp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sb.erp.dto.ApprDocDto;
import com.sb.erp.dto.ApprDocInitResponseDto;
import com.sb.erp.dto.ApprFormDto;
import com.sb.erp.dto.ApprLineDto;
import com.sb.erp.dto.DeptDto;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.security.CustomUserDetails;
import com.sb.erp.service.ApprDocService;
import com.sb.erp.service.DeptService;
import com.sb.erp.service.EmpService;
import com.sb.erp.util.PagingUtil;

@Controller
@RequestMapping("/appr")
public class ApprDocController {
	
	@Autowired ApprDocService service;
	@Autowired DeptService deptService;
	@Autowired EmpService empService;
	
	
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
	
	// 문서 작성 폼
	@GetMapping("/write_doc")
	public String writeDoc(Model model,
			@AuthenticationPrincipal CustomUserDetails userDetails) {
		// 데이터 넣고 페이지 들어갈때 값 가져와서 삽입
		ApprDocDto dto = new ApprDocDto();
		dto.setEmpId(userDetails.getUser().getEmpId());
		
		ApprDocInitResponseDto result = service.initResponse(dto);
		model.addAttribute("dto", result);
		return "appr/write_doc";
	}
	
	// 문서 작성 처리
	@PostMapping("/write_doc")
	public String writeDoc_post(ApprDocDto dto,
			@AuthenticationPrincipal CustomUserDetails userDetails) {
		
		dto.setEmpId(userDetails.getUser().getEmpId());
		dto.setComId(userDetails.getUser().getComId());
		
		boolean result = service.insertLines(dto);
		
		// 위 호출에서 성공시
		if(result) {
			return "redirect:/appr/list_doc";
		}
		return "appr/write_doc";
	}
	
	//////////////////////////// 문서 작성 처리 파트 /////////////////////////////
	
	//////////////////////////// 문서 조회 처리 파트 /////////////////////////////
	
	@GetMapping("/list_doc")
	public String listDoc(Model model,
			@RequestParam(defaultValue = "history") String tab,
			@RequestParam(required = false) String keyword,
			@RequestParam(required = false) String status,
			@RequestParam(defaultValue = "1") int page,
			@AuthenticationPrincipal CustomUserDetails userDetails) {
		
		// 로그인 유저 정보 가져오기 (emp_id)
		ApprDocDto dto = new ApprDocDto(); 
		dto.setEmpId(userDetails.getUser().getEmpId());
		dto.setSearchKeyword(keyword);
		dto.setSearchStatus(status);
		
		int myTodoCnt = service.selectMyTodoDocsCnt(dto);
		
		// 카운트
		Map<String, Object> docCnts = service.selectDocCnt(dto);

		int totalCnt = "todo".equals(tab) ?
				myTodoCnt :
				service.selectMyHistoryDocsCnt(dto);
		

		PagingUtil paging = new PagingUtil(totalCnt, page);
		dto.setPstartno(paging.getPstartno());
		dto.setOnepagelist(paging.getOnepagelist());
		
		List<Map<String, Object>> hisDocs = List.of();
		List<Map<String, Object>> todoDocs = List.of();
		
		if("todo".equals(tab)) {
			todoDocs = service.selectMyTodoDocs(dto);
		}
		else {
			hisDocs = service.selectMyHistoryDocs(dto);
		}
		
		model.addAttribute("paging", paging);
		model.addAttribute("docCnts", docCnts);
		model.addAttribute("myTodoCnt", myTodoCnt);
		model.addAttribute("hisDocs", hisDocs);
		model.addAttribute("todoDocs", todoDocs);
		model.addAttribute("activeTab", tab);
		model.addAttribute("status", status);
		model.addAttribute("keyword", keyword);
		model.addAttribute("page", page);
		
		return "appr/list_doc";
	}
	
	//////////////////////////// 문서 조회 처리 파트 /////////////////////////////

	//////////////////////////// 문서 승인,반려 처리 ///////////////////////////////
	
	@GetMapping("/detail_doc")
	public String detailDoc(@AuthenticationPrincipal CustomUserDetails userDetails,
						    @RequestParam("docId") int docId,
							Model model) {
		
		ApprDocDto doc = service.selectDocDetail(docId);
		
		// 결재선 가져와야함
		// 로그인 한사람 정보 가져와야함
		//
		
		return "appr/detail_doc";
	}
	
	//////////////////////////// 문서 승인,반려 처리 ///////////////////////////////
	
	//////////////////////////// 결재선 파트 ///////////////////////////////
	
	@GetMapping("/getApprLines")
	@ResponseBody
	public List<ApprLineDto> getApprLines(@RequestParam("isImportant") boolean isImportant,
				@AuthenticationPrincipal CustomUserDetails userDetails)	{
		ApprDocDto dto = new ApprDocDto();
		dto.setEmpId(userDetails.getUser().getEmpId());
		
		return service.approversByEmpId(dto);
	}
	
	// 결재선 지정용 부서 트리
	@GetMapping("/getDeptTree")
	@ResponseBody
	public List<DeptDto> getDeptTree(@AuthenticationPrincipal CustomUserDetails userDetails){
		return deptService.selectOrgTree(userDetails.getUser().getComId());
	}
	
	// 특정 부서 소속 사원 목록
	@GetMapping("/getDeptEmps")
	@ResponseBody
	public List<EmpDto> getDeptEmps(@RequestParam("deptId") int deptId) {
		return empService.selectByDeptId(deptId);
	}
	
	
	//////////////////////////// 결재선 파트 ///////////////////////////////
	
}
