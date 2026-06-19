package com.sb.erp.controller;

import java.util.HashMap;
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

import com.sb.erp.dto.EmpDto;
import com.sb.erp.service.EmpService;

@Controller
public class AuthController {
	@Autowired EmpService empService;
	@Autowired BCryptPasswordEncoder passEncoder;
	
	@RequestMapping("/")
	public String index() {
		return "index";
	}
	
	@RequestMapping(value="/auth/login", method = RequestMethod.GET)
	public String login() {
		return "/auth/login";
	}
	
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
		model.addAttribute("emp", empService.selectByEmpId(empId));
		return "/auth/resetPass";
	}
	
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
	
	@RequestMapping(value="/auth/fail", method=RequestMethod.GET)
	public String loginFail(HttpServletRequest request) {

	    // TODO: 실패 로그 적재 — 마지막 시도 이메일은 세션에서 꺼낼 수 있습니다.
	    // String username = (String) request.getSession()
	    //         .getAttribute("SPRING_SECURITY_LAST_USERNAME");
	    // String ip = request.getRemoteAddr();
	    // failLogService.save(username, ip, new Date());

	    return "redirect:/auth/login?error=true";
	}
}
