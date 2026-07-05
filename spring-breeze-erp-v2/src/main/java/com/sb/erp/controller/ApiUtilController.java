package com.sb.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.sb.erp.api.ApiEmail;

@Controller
@RequestMapping("/api/util")
public class ApiUtilController {
	//mail
	@Autowired ApiEmail apiEmail;
	
	@GetMapping("/mail")
	public String mail_get() { return "util/mail"; }
	
	@PostMapping("/mail")
	public String mail_post(String subject, String content, String email) {
		apiEmail.sendMail(subject, content, email);
		return "util/mail_result";
	}
}
