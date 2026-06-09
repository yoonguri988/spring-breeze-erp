package sb.erp.controller;

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

import sb.erp.dto.CompanyDto;
import sb.erp.service.CompanyService;
import sb.erp.utils.PagingUtil;

@Controller
public class CompanyController {
	@Autowired CompanyService service;
	
	@RequestMapping("/")
	public String index() {
		return "redirect:/company/list.do?keyword=";
	}
	
	// 등록 폼
	@RequestMapping(value="/company/add.do", method= RequestMethod.GET)
	public String addForm() {
		return "/company/form";
	}
	
	// 등록 처리
	@RequestMapping(value="/company/add.do", method= RequestMethod.POST)
	public String add(CompanyDto dto, RedirectAttributes rttr) {
		String msg = "회사 등록에 실패하였습니다.";
		if(service.add(dto) > 0) { msg = "회사 등록에 성공하였습니다."; }
		rttr.addFlashAttribute("msg", msg);
	    return "redirect:/company/list.do?keyword=";
	}
	
	//사업자번호 중복 체크 (ajax)
	@RequestMapping(value="/company/checkBizNo.do", method = RequestMethod.GET)
	public Map<String, Boolean> checkBizNo(String bizNo){
		boolean isDup = service.isDuplicateBizNo(bizNo);
		return Map.of("duplicate", isDup);
	}
	
	// 회사 목록 조회
	@RequestMapping(value="/company/list.do", method= RequestMethod.GET)
	public String list(@RequestParam("keyword")String keyword,
			@RequestParam(value="pstartno", defaultValue = "1") int pstarValue,
			@RequestParam("onepagelist") int onepagelist,
			Model model) {
		int listtotal = service.listTotal(keyword);
		model.addAttribute("paging", new PagingUtil(listtotal, onepagelist, pstarValue));
//		model.addAttribute("items", service.list(keyword, onepagelist, pstarValue));
		return "/company/list";
	}
	
	//
	@RequestMapping(value="/company/suggest.do", method=RequestMethod.GET)
	@ResponseBody
	public List<CompanyDto> suggest(@RequestParam("keyword") String keyword) {
	    return service.getSuggest(keyword); // 최대 5건
	}
	
	// 수정 폼
	@RequestMapping(value="/company/edit.do", method = RequestMethod.GET)
	public String editForm(int companyId, Model model) {
		model.addAttribute("com", service.selectOneById(companyId));
		return "/company/edit";
	}
	
	// 수정 처리
	@RequestMapping(value="/company/edit.do", method = RequestMethod.POST)
	public String edit(CompanyDto dto, RedirectAttributes rttr) {
		String msg = "회사 정보 수정에 실패하였습니다.";
		if(service.update(dto) > 0) { msg = "회사 정보가 수정되었습니다.";}
		rttr.addFlashAttribute("msg", msg);
		return "redirect:/company/list.do?keyword=";
	}
	
	// 삭제 처리
	@RequestMapping(value="/company/delete.do", method = RequestMethod.GET)
	public String delete(int companyId, RedirectAttributes rttr) {
		String msg = "삭제에 실패하였습니다.";
		try {
			if(service.delete(companyId) > 0) { msg ="삭제 되었습니다.";}
			rttr.addFlashAttribute("msg", msg);
		} catch (IllegalArgumentException e) {
			rttr.addFlashAttribute("msg", e.getMessage());
		}
		return "redirect:/company/list.do?keyword=";
	}
	
	
}
