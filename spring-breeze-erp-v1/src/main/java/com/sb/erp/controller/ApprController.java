package com.sb.erp.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
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
import com.sb.erp.util.PagingUtil;

@Controller
public class ApprController {
	
	@Autowired ApprService appr;
	
	
	@RequestMapping( value = "/searchCompany", method = RequestMethod.GET)
	@ResponseBody
	public List<CompanySearchDto> searchCompany(@RequestParam("company") String company){
		return appr.searchCompany(company);
	}
	
//	// 양식 리스트 입력한 값 찾기 -> 2차 프로젝트때 다시 시도.....
//	@RequestMapping( value = "/searchForms", method = RequestMethod.GET)
//	@ResponseBody
//	public Map<String, Object> searchForms(@RequestParam("keyword") String keyword,
//										 @RequestParam("company") String comId,
//										 @RequestParam( value = "forStatus", required = false) String status,
//										 @RequestParam( value = "page", defaultValue = "1") int page){
//		ApprFormSearchDto dto = new ApprFormSearchDto();
//		dto.setComId(
//				(comId == null || comId.isBlank()) ?
//				null : Integer.parseInt(comId)
//				);
//		dto.setForStatus(
//				(status == null || status.isBlank()) ?
//				null : Boolean.parseBoolean(status)
//				);
//		dto.setKeyword(keyword);
//		dto.setPage(page);
//		dto.setPageSize(10); // 한 페이지당 몇개들어갈건지
//		
//		//int totalCnt = appr.listFormCnt(dto);
//		
//		List<ApprFormDto> list = appr.selectFormList(dto);
//		int totalCnt = appr.listFormCnt(dto); 
//		
//		int pagetotal = (totalCnt == 0) ? 1 : (int) Math.ceil((double)totalCnt/ dto.getPageSize()); // 전체 페이지 수
//		int pageNum = 10; // 하단에 보여줄 버튼? 수
//		int start = ((page - 1) / pageNum) * pageNum + 1;
//		int end = Math.min(start + pageNum - 1, pagetotal);
//		
//		Map<String, Object> paging = new HashMap<>();
//		paging.put("current", page);
//		paging.put("pagetotal", pagetotal );
//		paging.put("start", start);
//		paging.put("end", end);
//		
//		Map<String, Object> result = new HashMap<>();
//		result.put("list", list);
//		result.put("paging", paging);
//		
//		return result;
//	}
	

	// 양식 리스트 입력한 값 찾기
	// required = false : 필수 값이 아니라고 설정
    // defaultValue = "" : 값이 안 넘어오면 디폴트값 지정
	@RequestMapping( value = "/searchForms", method = {RequestMethod.GET, RequestMethod.POST}) // GET, POST 두방식중 어느방식으로든 접근했을때 동일한 처리
	public String searchForms(@RequestParam( value = "keyword", required = false, defaultValue = "") String keyword,
							  @RequestParam( value = "comId", required = false, defaultValue = "") String comId,
							  @RequestParam( value = "forStatus", required = false, defaultValue = "") String status,
							  @RequestParam( value = "page", defaultValue = "1") int page,
							  Model model){
		// 검색어에 입력한 값들 지정하고
		ApprFormSearchDto dto = new ApprFormSearchDto();
		// 각각 dto의 파라미터 값에 맞게 타입 바꿔주기
		dto.setComId(
				(comId == null || comId.isBlank()) ?
				null : Integer.parseInt(comId)
				);
		dto.setForStatus(
				(status == null || status.isBlank()) ?
				null : Boolean.parseBoolean(status)
				);
		dto.setKeyword(keyword);
		
		// 전체 양식 수
		int totalCnt = appr.listFormCnt(dto);
		PagingUtil paging = new PagingUtil(totalCnt, page);
		
		// 페이징 번호 세팅 / 시작번호, 한줄에 보여질 페이지
		dto.setPage(paging.getPstartno());
		dto.setPageSize(paging.getOnepagelist());
		
		// 검색해서 나온 데이터, 페이징 list에 담기
		List<ApprFormDto> list = appr.selectFormList(dto);
		
		// jsp로 데이터 보내기
		model.addAttribute("list", list);
		model.addAttribute("paging", paging);
		model.addAttribute("keyword", keyword);
		model.addAttribute("comId", comId);
		model.addAttribute("forStatus", status);
		
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
//		System.out.println("제목 = " + dto.getForTitle());
//		System.out.println("내용 = " + dto.getForContent());
		
		if(appr.insertForm(dto) > 0) {
			return "redirect:/appr/list_form";
		}
		return "appr/write_form";
	}
	
	// 양식 리스트 폼
	@RequestMapping( value = "/appr/list_form", method = RequestMethod.GET)
	public String listForm() {
		return "appr/list_form";
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
		
		if(appr.updateForm(dto) > 0) {
			return "redirect:/appr/list_form";
		}
		return "appr/update_form";
	}
	
	@RequestMapping("/appr/delete")
	public String delete(int forId) {
		appr.deleteForm(forId);
		return "appr/list_form";
	}
	
	
}
