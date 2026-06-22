package com.sb.erp.controller;

import java.util.ArrayList;
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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sb.erp.dto.ApprFormDto;
import com.sb.erp.dto.ApprFormSearchDto;
import com.sb.erp.dto.CompanyDto;
import com.sb.erp.service.ApprService;
import com.sb.erp.service.CompanyService;
import com.sb.erp.util.PagingUtil;

@Controller
public class ApprController {
	@Autowired ApprService appr;
	@Autowired CompanyService com;
	
	// 회사 검색 기능
	@RequestMapping( value = "/searchCompany", method = RequestMethod.GET)
	@ResponseBody
	public List<CompanyDto> searchCompany(@RequestParam("company") String company){
		//return appr.searchCompany(company);
		return com.getSuggest(company);
	}
	
	// 양식 코드 중복 검사 기능
	@RequestMapping( value = "/checkCode", method = RequestMethod.GET)
	@ResponseBody
	public Map<String,Object> checkCode(@RequestParam("code") String code,
										@RequestParam("comId") String comId) {
		
		Map<String,Object> result = new HashMap<>();
		
		// null들어오면 뻑나는거 방지
		if(comId == null || comId.trim().isEmpty()) {
			result.put("checkCode", false);
			return result;
		}
		
		ApprFormDto dto = new ApprFormDto();
		dto.setComId(Integer.parseInt(comId));
		dto.setForCode(code);
		
		
		String find = appr.findByCode(dto);
		
		if(find != null) {
			result.put("checkCode", false);
		}
		else {
			result.put("checkCode", true);
		}
		
		return result;
	}
	
	// 양식 리스트 입력한 값 찾기
	// required = false : 필수 값이 아니라고 설정
    // defaultValue = "" : 값이 안 넘어오면 디폴트값 지정
	@RequestMapping( value = "/appr/list_form", method = RequestMethod.GET)
	public String searchForms(ApprFormSearchDto search, Model model){
		//1) 검색 조건이 null
		boolean isEmpty = !search.hasSearchCondition();
		
		int totalCnt = 0;
	    List<ApprFormDto> list = new ArrayList<>();
	    PagingUtil paging;
	    
	    //2) 검색 조건이 null, 쿼리 실행 자체를 안함
	    if(isEmpty) {
	    	paging = new PagingUtil(0, search.getPstartno());
	    }else {
	    	// 전체 양식 수
	    	totalCnt = appr.listFormCnt(search);
	    	paging = new PagingUtil(totalCnt, search.getPstartno());
	    	list = appr.selectFormList(search);
	    }
		
		// jsp로 데이터 보내기
		model.addAttribute("list", list);
		model.addAttribute("paging", paging);
		model.addAttribute("search", search);
		
		return "appr/list_form";
	} 

	
	// 양식 작성 폼
	@RequestMapping( value = "/appr/write_form", method = RequestMethod.GET)
	public String writeForm() {
		return "appr/write_form";
	}
	
	// 양식 작성 처리
	@RequestMapping( value = "/appr/write_form", method = RequestMethod.POST)
	public String writeForm_post(ApprFormDto dto, RedirectAttributes rttr) {
		// 양식 작성 성공
		if(appr.insertForm(dto) > 0) {
			return "redirect:/appr/list";
		}
		return "appr/write_form";
	}
	
	// 양식 상세보기
	@RequestMapping( value = "/appr/detail_form", method = RequestMethod.GET)
	public String detail(int forId, Model model) {
		
		ApprFormDto dto = appr.selectFormAll(forId);
		dto.setComName(appr.getCompanyName(dto.getComId()));
		
		model.addAttribute("dto", dto);
		return "appr/detail_form";
	}
	
	// 양식 수정 폼
	@RequestMapping( value = "/appr/update_form", method = RequestMethod.GET)
	public String update(int forId, Model model) {
		
		// 클릭한 해당 양식의 id값으로 데이터 담아서 jsp value들 채울 용도
		ApprFormDto dto = appr.selectFormAll(forId);
		dto.setComName(appr.getCompanyName(dto.getComId()));
				
		// update_form.jsp 로 데이터 보내기
		model.addAttribute("dto", dto);
		return "appr/update_form";
	}
	
	// 양식 수정 처리
	@RequestMapping( value = "/appr/update_form", method = RequestMethod.POST)
	public String update_post(ApprFormDto dto, Model model) {
		// 양식 수정 성공
		if(appr.updateForm(dto) > 0) {
			return "redirect:/appr/list";
		}
		return "appr/update_form";
	}
	
	// 양식 삭제 처리
	@RequestMapping("/appr/delete")
	public String delete(int forId) {
		appr.deleteForm(forId);
		return "appr/list_form";
	}
	
	
}


//// 양식 리스트 입력한 값 찾기 -> 2차 프로젝트때 다시 시도.....
//@RequestMapping( value = "/searchForms", method = RequestMethod.GET)
//@ResponseBody
//public Map<String, Object> searchForms(@RequestParam("keyword") String keyword,
//									 @RequestParam("company") String comId,
//									 @RequestParam( value = "forStatus", required = false) String status,
//									 @RequestParam( value = "page", defaultValue = "1") int page){
//	ApprFormSearchDto dto = new ApprFormSearchDto();
//	dto.setComId(
//			(comId == null || comId.isBlank()) ?
//			null : Integer.parseInt(comId)
//			);
//	dto.setForStatus(
//			(status == null || status.isBlank()) ?
//			null : Boolean.parseBoolean(status)
//			);
//	dto.setKeyword(keyword);
//	dto.setPage(page);
//	dto.setPageSize(10); // 한 페이지당 몇개들어갈건지
//	
//	//int totalCnt = appr.listFormCnt(dto);
//	
//	List<ApprFormDto> list = appr.selectFormList(dto);
//	int totalCnt = appr.listFormCnt(dto); 
//	
//	int pagetotal = (totalCnt == 0) ? 1 : (int) Math.ceil((double)totalCnt/ dto.getPageSize()); // 전체 페이지 수
//	int pageNum = 10; // 하단에 보여줄 버튼? 수
//	int start = ((page - 1) / pageNum) * pageNum + 1;
//	int end = Math.min(start + pageNum - 1, pagetotal);
//	
//	Map<String, Object> paging = new HashMap<>();
//	paging.put("current", page);
//	paging.put("pagetotal", pagetotal );
//	paging.put("start", start);
//	paging.put("end", end);
//	
//	Map<String, Object> result = new HashMap<>();
//	result.put("list", list);
//	result.put("paging", paging);
//	
//	return result;
//}
