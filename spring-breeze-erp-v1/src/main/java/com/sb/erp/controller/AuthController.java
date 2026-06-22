package com.sb.erp.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sb.erp.dto.AuthPermDto;
import com.sb.erp.dto.AuthUserDto;
import com.sb.erp.dto.ComSearchDto;
import com.sb.erp.dto.CompanyDto;
import com.sb.erp.dto.EmpAuthDto;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.security.CustomUser;
import com.sb.erp.service.AuthService;
import com.sb.erp.service.CompanyService;
import com.sb.erp.service.EmpService;

@Controller
public class AuthController {
	@Autowired AuthService service;
	@Autowired EmpService empService;
	@Autowired CompanyService comService;
	@Autowired BCryptPasswordEncoder passEncoder;
	
	@RequestMapping("/")
	public String index() {
		return "index";
	}
	
	// 로그인 페이지로 이동
	@RequestMapping(value="/auth/login", method = RequestMethod.GET)
	public String login() {
		return "/auth/login";
	}
	
	// 비밀번호를 변경하려는 사용자가 실제로 존재하는지 여부 확인
	@RequestMapping(value="/auth/confirm", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> confirm(EmpDto dto, HttpSession session) {
		Map<String, Object> result = new HashMap<>();
		EmpDto emp = empService.selectForVerify(dto);
		if (emp == null) {
	        result.put("state", "FAIL");
	        return result;
	    }
		
		session.setAttribute("empId", emp.getEmpId());
		result.put("state", "OK");
		return result;
	}
	
	// 로그인 후 강제 재설정
	@RequestMapping(value="/auth/resetPass", method = RequestMethod.GET)
	public String reset_pass(Authentication authentication, Model model) {
	    if (authentication == null) return "redirect:/auth/login";
	    
	    EmpDto emp = empService.selectByEmpEmail(authentication.getName());
		model.addAttribute("emp", emp);
		return "/auth/resetPass";
	}
	
	// 비밀번호 분실 - session(empId) 기반, 본인확인 후에만 진입 가능
	@RequestMapping(value="/auth/forgotResetPass", method = RequestMethod.GET)
	public String reset_pass(HttpSession session, Model model) {
		Integer empId = (Integer) session.getAttribute("empId");
		if(empId == null || empId == 0) return "redirect:/auth/login";
		model.addAttribute("emp", empService.selectAuthByEmpId(empId));
		return "/auth/resetPass";
	}
	
	// 비밀번호 재설정 기능
	@RequestMapping(value="/auth/updatePass", method = RequestMethod.POST)
	public String update_pass(@RequestParam(value="empPass", required = true) String empPass,
			                  @RequestParam(value="empId", required = true) Integer empId,
							  HttpSession session
			) {
		EmpDto dto = new EmpDto();
		dto.setEmpPass(passEncoder.encode(empPass)); dto.setEmpId(empId);
		empService.updatePassByEmpId(dto);
		return "redirect:/auth/login";
	}
	
	// 로그인 실패시 화면 구현
	@RequestMapping(value="/auth/fail", method=RequestMethod.GET)
	public String loginFail(HttpServletRequest request) {

	    // TODO: 실패 로그 적재 — 마지막 시도 이메일은 세션에서 꺼낼 수 있습니다.
	    // String username = (String) request.getSession()
	    //         .getAttribute("SPRING_SECURITY_LAST_USERNAME");
	    // String ip = request.getRemoteAddr();
	    // failLogService.save(username, ip, new Date());

	    return "redirect:/auth/login?error=true";
	}
	
	// 권한 목록
//	@RequestMapping(value="/auth/list", method=RequestMethod.GET)
//	public String list(@RequestParam(value="comId", required=false)Integer comId,
//			 		   @RequestParam(value="autId", required=false)Integer autId,
//			 		   HttpSession session,
//			 		   Authentication authentication,
//			           Model model) {
//		// 로그인 사용자의 권한 목록 추출
//	    List<String> roles = new ArrayList<>();
//	    authentication.getAuthorities().forEach(auth -> roles.add(auth.getAuthority()));
//	    boolean isRoot = roles.contains("ROOT");
//	    
//	    // 로그인 사용자 정보
//	    CustomUser login = (CustomUser) authentication.getPrincipal();
//	    AuthUserDto dto = login.getDto();
//	    if (!isRoot) { comId = dto.getComId(); }
//
//		List<AuthPermDto> authList = service.selectAll(comId);
//		
//		// autId 파라미터 결과 값 유무에 따라
//		AuthPermDto selectedRole = null;
//		if(autId != null) selectedRole = service.selectOneById(autId);
//		
//		// comId 파라미터 결과 값 유무에 따라
//		List<EmpAuthDto> empList = Collections.emptyList();
//		if(comId != null) empList = empService.selectAuthByComId(comId);
//		
//		// 회사 목록 리스트
//		ComSearchDto search = new ComSearchDto();
//		List<CompanyDto> comList = comService.list(search);
//		
//		model.addAttribute("authList", authList);
//		model.addAttribute("selectedRole", selectedRole);
//		model.addAttribute("empList", empList);
//		model.addAttribute("companyList", comList);
//		//
//		CompanyDto com = comId == null? null : comService.selectOneById(comId);
//		model.addAttribute("com", com);
//		return "/auth/list";
//	}
	
	// 권한 추가 폼
//	@RequestMapping(value="/auth/add", method=RequestMethod.GET)
//	public String add() {
//		return "/auth/add";
//	}
	
	// 권한 추가 기능
//	@RequestMapping(value="/auth/add", method=RequestMethod.POST)
//	public String add_post(AuthPermDto dto) {
//		service.insert(dto);
//		return "redirect:/auth/edit";
//	}
	
	// 권한 수정 폼
//	@RequestMapping(value="/auth/edit", method=RequestMethod.GET)
//	public String edit(AuthPermDto dto, Model model) {
//		AuthPermDto auth = service.selectOneById(dto.getAutId());
//		model.addAttribute("auth", auth);
//		return "/auth/edit";
//	}
//	
	// 권한 수정 기능
//	@RequestMapping(value="/auth/edit", method=RequestMethod.POST)
//	public String edit_post(AuthPermDto dto) {
//		service.update(dto);
//		return "redirect:/auth/edit";
//	}
	
	// 모달 팝업 구현 예정
//	@RequestMapping(value="/perm/del", method=RequestMethod.GET)
//	public String del() {
//		return "/perm/del";
//	}
	
	//권한 삭제 기능
//	@RequestMapping(value="/auth/del", method=RequestMethod.POST)
//	public String del_post(AuthPermDto dto) {
//		//비밀번호 확인 과정 필요
//		service.delete(dto);
//		return "redirect:/auth/list";
//	}
}
