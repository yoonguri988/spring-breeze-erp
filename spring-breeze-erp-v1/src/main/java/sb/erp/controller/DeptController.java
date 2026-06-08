package sb.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import sb.erp.dto.DeptDto;
import sb.erp.service.DeptService;

@Controller
public class DeptController {
	@Autowired DeptService service;
	
//	@RequestMapping("/")
//	public String index() {
//		return "redirect:/dept/tree.do?companyId=1";
//	}
	
	// 조직도 조회
	@RequestMapping(value="/dept/tree.do", method=RequestMethod.GET)
	public String orgTree(int companyId, Model model) {
		model.addAttribute("items", service.selectOrgTree(companyId));
		model.addAttribute("companyId", companyId);
		return "/dept/orgChart";
	}
	
	// 부서 등록 폼
	@RequestMapping(value="/dept/add.do", method=RequestMethod.GET)
	public String addForm(int companyId, Model model) {
		model.addAttribute("items", service.flattenOrgTree(companyId));
		model.addAttribute("companyId", companyId);
		return "/dept/addForm";
	}
	
	// 부서 등록 기능
	@RequestMapping(value="/dept/add.do", method=RequestMethod.POST)
	public String addForm_post(int companyId, DeptDto dto, RedirectAttributes rttr) {
		String msg = "등록 처리에 실패하였습니다";
		if(service.insert(dto) > 0) { msg = "등록 처리에 성공하였습니다."; }
		rttr.addFlashAttribute("msg", msg);
		return "redirect:/dept/tree.do?companyId="+companyId;
	}
	
	// 부서 수정 폼
	@RequestMapping(value="/dept/edit.do", method=RequestMethod.GET)
	public String editForm(int deptId, Model model) {
		DeptDto dto = service.selectOneById(deptId);
		model.addAttribute("dto", dto);
		model.addAttribute("items", service.flattenOrgTree(dto.getCompanyId()));
		model.addAttribute("companyId", dto.getCompanyId());
		return "/dept/editForm";
	}
	
	// 부서 수정 기능
	@RequestMapping(value="/dept/edit.do", method=RequestMethod.POST)
	public String editForm_post(int deptId, DeptDto dto, RedirectAttributes rttr) {
		DeptDto se = service.selectOneById(deptId);
		try {
			service.update(dto);
			rttr.addFlashAttribute("msg", "수정 되었습니다.");
		} catch (IllegalStateException e) {
			rttr.addFlashAttribute("msg", e.getMessage());
		}
		return "redirect:/dept/tree.do?companyId="+se.getCompanyId();
	}
	
	//부서 삭제
	@RequestMapping(value="/dept/delete.do", method=RequestMethod.GET)
	public String delete_post(int deptId, RedirectAttributes rttr) {
		DeptDto dto = service.selectOneById(deptId);
		try {
			service.delete(deptId);
			rttr.addFlashAttribute("msg", "삭제 되었습니다.");
		} catch (IllegalStateException e) {
			rttr.addFlashAttribute("msg", e.getMessage());
		}
		return "redirect:/dept/tree.do?companyId="+dto.getCompanyId();
	}
}
