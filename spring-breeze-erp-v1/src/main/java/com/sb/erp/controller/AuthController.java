package com.sb.erp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class AuthController {
	@RequestMapping("/")
	public String index() {
		return "index";
	}
	
	@RequestMapping(value="/auth/login", method = RequestMethod.GET)
	public String login() {
		return "/auth/login";
	}
	
	@RequestMapping(value="/auth/resetPass", method = RequestMethod.GET)
	public String reset_pass() {
		return "/auth/resetPass";
	}
}
