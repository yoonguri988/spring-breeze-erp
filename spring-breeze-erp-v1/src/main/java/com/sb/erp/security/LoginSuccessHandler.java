package com.sb.erp.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.sb.erp.dto.EmpDto;
import com.sb.erp.service.EmpService;

public class LoginSuccessHandler implements AuthenticationSuccessHandler{   
	@Autowired EmpService service;
	@Autowired BCryptPasswordEncoder passEncoder;
	
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, 
										 HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
	 
		List<String>  roles = new ArrayList<>();
		
		authentication.getAuthorities().forEach(auth->{ roles.add(auth.getAuthority()); });

		String empEmail = authentication.getName();
		EmpDto dto = service.selectByEmpEmail(empEmail);
		//세션에 사원 id 저장
		HttpSession session = request.getSession();
		session.setAttribute("empId", dto.getEmpId());
		session.setAttribute("comId", dto.getComId());
		
		// 시스템 관리자(총괄)
		if(roles.contains("ROOT")) {
			response.sendRedirect( request.getContextPath() + "/"   );
		} else {
			// 관리자가 아니고 비밀번호가 초기설정인 경우에 비밀번호 재설정 페이지로 이동
			if(!roles.contains("ROLE_ADMIN") && passEncoder.matches("1234", dto.getEmpPass())) {
				response.sendRedirect( request.getContextPath() + "/auth/resetPass"   );
			} else {
				if(roles.contains("ROLE_ADMIN")){ 
					response.sendRedirect( request.getContextPath() + "/"   );
				} else {
					response.sendRedirect( request.getContextPath() + "/"   );
				}
			}
		}
	}
}
