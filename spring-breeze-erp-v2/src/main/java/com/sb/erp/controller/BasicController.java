package com.sb.erp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpSession;

@Controller
public class BasicController {
	
	@GetMapping("/")
	public String index(HttpSession session, Model model) { 
		
		// 403 오류시 - 메시지 표시 후 제거
	    Object msg = session.getAttribute("accessDeniedMsg");
	    if (msg != null) {
	        model.addAttribute("accessDeniedMsg", msg);
	        session.removeAttribute("accessDeniedMsg");
	    }
	    
		return "index"; 
		
	}
	
}
