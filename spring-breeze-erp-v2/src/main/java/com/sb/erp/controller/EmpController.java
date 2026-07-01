package com.sb.erp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.EmpSearchDto;
import com.sb.erp.security.CustomUser;
import com.sb.erp.service.DeptService;
import com.sb.erp.service.EmpService;
import com.sb.erp.service.PosService;
import com.sb.erp.util.PagingUtil;

@Controller
public class EmpController {

	@Autowired EmpService empService;
	@Autowired PosService posService;
	@Autowired DeptService deptService;
	@Autowired PasswordEncoder passEncoder;
	
	// 로그인한 유저의 com_id 가져오기 (컨트롤러 내부 공통 메서드)
	private int getCurrentComId(Authentication authentication) {
		CustomUser principal = (CustomUser) authentication.getPrincipal();
		return principal.getDto().getComId();
	}
	
	// 조회 목록 + 페이징 유틸 이용하기
	@RequestMapping("/emp/list")
	public String list(EmpSearchDto search, 
			@RequestParam(value = "searched", required = false) String searched,
			Model model,
			Authentication authentication) {
		
		int comId = getCurrentComId(authentication);
		
		boolean hasFilter = search.getDeptId() != null
		     || search.getPosId() != null
		     || (search.getEmpStatus() != null && !search.getEmpStatus().isEmpty())
		     || (search.getKeyword() != null && !search.getKeyword().trim().isEmpty());

		if (searched != null && hasFilter) {
			int total = empService.selectCnt(search, comId);
			PagingUtil paging = new PagingUtil(total, search.getPstartno());
			List<EmpDto> empList = empService.search(search, comId);
			
			model.addAttribute("empList", empList);
			model.addAttribute("paging", paging);
		}
		
		model.addAttribute("search", search);
		model.addAttribute("posList", posService.selectAll());
		model.addAttribute("deptList", deptService.selectAll());
		return "emp/list";
	}

	// 상세페이지
	@RequestMapping("/emp/detail")
	public String detail(@RequestParam int empId, Model model, Authentication authentication) {
		int comId = getCurrentComId(authentication);
		EmpDto emp = empService.selectByEmpId(empId, comId);
		model.addAttribute("emp", emp);
		
		EmpDto loginEmp = empService.selectByEmpEmail(authentication.getName());
		if (loginEmp != null) {
			model.addAttribute("loginEmpId", loginEmp.getEmpId());
		}
		return "emp/detail";
	}
	
	// 사원 등록 get
	@RequestMapping(value="/emp/add" , method=RequestMethod.GET)
	public String addEmp(Model model) {
	    model.addAttribute("posList", posService.selectAll());
	    model.addAttribute("deptList", deptService.selectAll());
	    return "emp/add";
	}

	// 사원 등록 post
	@RequestMapping(value="/emp/add" , method=RequestMethod.POST)
	public String addEmpPost(EmpDto dto, Authentication authentication) {
		int comId = getCurrentComId(authentication);
		empService.insert(dto, comId);
		return "redirect:/emp/list";
	}
	
	// 사원 정보 수정
	@RequestMapping(value="/emp/edit" , method=RequestMethod.GET)
	public String editForm(@RequestParam int empId, Model model, Authentication authentication) {
		int comId = getCurrentComId(authentication);
		model.addAttribute("emp", empService.selectByEmpId(empId, comId));
		model.addAttribute("posList", posService.selectAll());
		model.addAttribute("deptList", deptService.selectAll());
	    return "emp/edit";
	}
	
	@RequestMapping(value="/emp/edit" , method=RequestMethod.POST)
	public String editProcess(EmpDto dto, Authentication authentication) {
		int comId = getCurrentComId(authentication);
	    empService.update(dto, comId);
	    return "redirect:/emp/detail?empId="+ dto.getEmpId(); 
	}
	
	// 비밀번호 초기화(관리자)
	@RequestMapping(value="/emp/resetPass", method=RequestMethod.GET)
	public String resetPass(@RequestParam int empId, Model model, Authentication authentication) {
		int comId = getCurrentComId(authentication);
		model.addAttribute("emp", empService.selectByEmpId(empId, comId));
		return "emp/resetPass";
	}
	
	@RequestMapping(value="/emp/resetPass", method=RequestMethod.POST)
	public String resetPassPost(@RequestParam int empId, Authentication authentication) {
		int comId = getCurrentComId(authentication);
		EmpDto emp = empService.selectByEmpId(empId, comId);
		EmpDto dto = new EmpDto();
		dto.setEmpId(empId);
		dto.setEmpPass(passEncoder.encode(emp.getEmpNo()));
		empService.updatePassByEmpId(dto);
		
		return "redirect:/emp/detail?empId="+ dto.getEmpId(); 
	}
	
	// 비밀번호 초기화(사용자)
	@RequestMapping(value="/emp/editPass", method=RequestMethod.GET)
	public String editPass(@RequestParam int empId, Model model, Authentication authentication) {
		int comId = getCurrentComId(authentication);
		model.addAttribute("emp", empService.selectByEmpId(empId, comId));
		return "emp/editPass";
	}
	
	@RequestMapping(value="/emp/editPass", method=RequestMethod.POST)
	public String editPassPost(@RequestParam int empId,
							   @RequestParam String currentPass,
							   @RequestParam String editPass,
							   @RequestParam String checkPass) 
	{	
		if (!editPass.equals(checkPass)) { return "emp/editPass"; }
		
		EmpDto chk = new EmpDto();
		chk.setEmpId(empId);
		chk.setEmpPass(currentPass);
		if (!empService.matchPassword(chk)) { return "emp/editPass"; }
		
		EmpDto dto = new EmpDto();
		dto.setEmpId(empId);
		dto.setEmpPass(passEncoder.encode(editPass));
		empService.updatePassByEmpId(dto);
		
		return "redirect:/emp/detail?empId="+ empId;		
	}
	
	// 이메일 중복 검사
	@RequestMapping(value="/emp/checkEmail", method=RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> checkEmail(@RequestParam String empEmail) {
	    boolean duplicate = empService.isEmailDuplicate(empEmail);
	    Map<String, Object> result = new HashMap<>();
	    result.put("duplicate", duplicate);
	    return result;
	}
	
	// 모바일 중복 검사
	@RequestMapping(value="/emp/checkMobile", method=RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> checkMobile(@RequestParam String empMobile) {
	    boolean duplicate = empService.isMobileDuplicate(empMobile);
	    Map<String, Object> result = new HashMap<>();
	    result.put("duplicate", duplicate);
	    return result;
	}
	
	// 사번 중복 검사
	@RequestMapping(value="/emp/checkEmpNo", method=RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> checkEmpNo(@RequestParam String empNo, Authentication authentication) {
		int comId = getCurrentComId(authentication);
	    boolean duplicate = empService.isEmpNoDuplicate(empNo, comId);
	    Map<String, Object> result = new HashMap<>();
	    result.put("duplicate", duplicate);
	    return result;
	}
}