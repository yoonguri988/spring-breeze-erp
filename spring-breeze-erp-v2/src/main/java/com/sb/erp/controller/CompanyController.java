package com.sb.erp.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sb.erp.dto.AuthPermDto;
import com.sb.erp.dto.ComSearchDto;
import com.sb.erp.dto.CompanyDto;
import com.sb.erp.dto.DeptDto;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.StatsComDto;
import com.sb.erp.dto.StatsDeptDto;
import com.sb.erp.exception.FileUploadException;
import com.sb.erp.service.CompanyService;
import com.sb.erp.service.DeptService;
import com.sb.erp.service.EmpService;
import com.sb.erp.service.PermService;
import com.sb.erp.util.FileUploadDto;
import com.sb.erp.util.FileUploadType;
import com.sb.erp.util.FileUploadUtil;
import com.sb.erp.util.PagingUtil;

import jakarta.servlet.http.HttpSession;

@Controller
public class CompanyController {
	@Autowired CompanyService service;
	@Autowired EmpService empService;
	@Autowired PermService permService;
	@Autowired DeptService deptService;
	
	// 회사 등록
	@RequestMapping(value="/com/add", method= RequestMethod.GET)
	public String addForm() {
		return "/com/form";
	}
	
	//회사 등록 기능
	@RequestMapping(value="/com/add", method= RequestMethod.POST)
	public String add(CompanyDto dto, 
			@RequestParam(value="logoFile", required=false) MultipartFile logoFile,
			RedirectAttributes rttr) {
		String msg = "회사 등록에 실패하였습니다.";
		
		try {
			if (logoFile != null && !logoFile.isEmpty()) {
				FileUploadDto result = FileUploadUtil.upload(logoFile, FileUploadType.COMPANY_LOGO);
				dto.setComLogo(result.getFileUrl());
			}
			if(service.add(dto) > 0) { msg = "회사 등록에 성공하셨습니다."; }
		} catch (FileUploadException e) {
			msg = e.getMessage();
		}
		
		rttr.addFlashAttribute("msg", msg);
	    return "redirect:/com/list";
	}
	
	// 회사 사업자 번호 중복 체크 (ajax)
	@RequestMapping(value="/com/checkBizNo", method = RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> checkBizNo(String bizNo){
		Map<String, Object> res = new HashMap<>();
		CompanyDto dto = service.isDuplicateBizNo(bizNo);
		
		if(dto != null) res.put("duplicate", true);
		else res.put("duplicate", false);
		
		return res;
	}
	
	// 회사 목록 조회
	@RequestMapping(value="/com/list", method= RequestMethod.GET)
	public String list(ComSearchDto search, Model model, HttpSession session) {
		Integer empId = (Integer) session.getAttribute("empId");
		//만약 로그인 사용자가 시스템 관리자가 아닌 경우
		//1-1. 로그인사용자가 ROOT(시스템관리자) 인가?
	    AuthPermDto root = permService.selectByEmpId(empId);
		
	    if(!root.getAutName().equals("ROOT")) return "redirect:/com/my";
		
		int listtotal = service.listTotal(search);
		PagingUtil paging = new PagingUtil(listtotal, search.getPstarValue(), search.getOnepagelist(), 10);
		//통계 데이터
		StatsComDto stats = service.selectStats();
		
		model.addAttribute("stats", stats);
		model.addAttribute("paging", paging);
		model.addAttribute("items", service.list(search));
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
		model.addAttribute("items", deptService.selectOrgTree(comId));
		return "/com/edit";
	}
	
	// 회사 수정 기능
	@RequestMapping(value="/com/edit", method = RequestMethod.POST)
	public String edit(CompanyDto dto, 
			@RequestParam(value="logoFile", required=false) MultipartFile logoFile,
			RedirectAttributes rttr) {
		String msg = "회사 정보 수정에 실패 하였습니다.";
		// 새 파일을 안 올렸을 때 기존 로고 URL을 유지하기 위해 수정 전 데이터를 먼저 조회
		try {
			CompanyDto before = service.selectOneById(dto.getComId());
			String oldLogoUrl = (before != null) ? before.getComLogo() : null;

			if (logoFile != null && !logoFile.isEmpty()) {
				FileUploadDto result = FileUploadUtil.upload(logoFile, FileUploadType.COMPANY_LOGO);
				dto.setComLogo(result.getFileUrl());
			} else {
				dto.setComLogo(oldLogoUrl);
			}
			if(service.update(dto) > 0) { 
				msg = "회사 정보 수정에 성공하셨습니다.";
				// 로고를 교체한 경우에만 기존 파일 정리
				if (logoFile != null && !logoFile.isEmpty()) {
					FileUploadUtil.delete(oldLogoUrl);
				}
			}
		} catch (FileUploadException e) {
			msg = e.getMessage();
		}
		
		rttr.addFlashAttribute("msg", msg);
		return "redirect:/com/list";
	}
	
	// 회사 삭제 폼
	@RequestMapping(value="/com/delete", method = RequestMethod.GET)
	public String deleteModal(@RequestParam("comId") Integer comId, Model model) {
	    CompanyDto dto = service.selectOneById(comId);
	    model.addAttribute("com", dto);
		return "/com/delModal";
	}
	
	// 회사 삭제 기능
	@RequestMapping(value="/com/delete", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> delete(Authentication auth, EmpDto dto) {
	    Map<String, Object> result = new HashMap<>();
	    
	    EmpDto emp = empService.selectByEmpEmail(auth.getName());
	    //1. 로그인한 사용자가 관리자가 아닌 경우
	    //1-1. 로그인사용자가 ROOT(시스템관리자) 인가?
	    AuthPermDto root = permService.selectByEmpId(emp.getEmpId());
	    
	    // ROOT(시스템 관리자) 아닌 경우
	    if(!root.getAutName().equals("ROOT")) {
	        throw new IllegalStateException("시스템 관리자 외에는 회사를 삭제할 수 없습니다.");
	    }

	    //2. 관리자가 입력한 비밀번호가 일치 하지 않을 경우
	    dto.setEmpId(emp.getEmpId());
	    boolean matched = empService.matchPassword(dto);
	    if (!matched) {
	        result.put("success", false);
	        result.put("message", "비밀번호가 올바르지 않습니다.");
	        return result;
	    }

	    service.delete(dto.getComId());
	    result.put("success", true);
	    return result;
	}
	
	// 회사 정보 상세 조회
	@RequestMapping(value="/com/detail", method=RequestMethod.GET)
	public String myDetail(@RequestParam("comId") int comId,
						   Model model) {
		//통계 데이터
		StatsDeptDto stats = deptService.selecStats(comId);
		List<DeptDto> deptList = deptService.selectOrgTree(comId);
		CompanyDto com = service.selectOneById(comId);
		
		model.addAttribute("stats", stats);
		model.addAttribute("com", com);
		model.addAttribute("deptList", deptList);
		return "/com/detail";
	}
	
	// 내 회사 정보 조회
	@RequestMapping(value="/com/my", method=RequestMethod.GET)
	public String mycom(Principal prinipal, HttpSession session, Model model) {
		Integer empId = (Integer) session.getAttribute("empId");
		Integer comId = (Integer) session.getAttribute("comId");
		if(empId == null || comId == null) return "redirect:/auth/login";
		
		CompanyDto com = service.selectOneByEmpId(empId);
		//통계 데이터
		StatsDeptDto stats = deptService.selecStats(comId);
		List<DeptDto> deptList = deptService.selectOrgTree(comId);
				
		model.addAttribute("stats", stats);
		model.addAttribute("com", com);
		model.addAttribute("deptList", deptList);
		return "/com/mypage";
	}
}