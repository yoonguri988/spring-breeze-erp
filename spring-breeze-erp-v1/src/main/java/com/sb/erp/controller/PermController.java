package com.sb.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.sb.erp.service.PermService;

@Controller
public class PermController {
	@Autowired PermService service;
	
	// 권한 목록
	@RequestMapping(value="/perm/list", method=RequestMethod.GET)
	public String list() {
		return "/perm/list";
	}
	
	// 권한 추가 폼
	@RequestMapping(value="/perm/add", method=RequestMethod.GET)
	public String add() {
		return "/perm/add";
	}
	
	// 권한 추가 기능
	@RequestMapping(value="/perm/add", method=RequestMethod.POST)
	public String add_post() {
		return "redirect:/perm/edit";
	}
	
	// 권한 수정 폼
	@RequestMapping(value="/perm/edit", method=RequestMethod.GET)
	public String edit() {
		return "/perm/add";
	}
	
	// 권한 수정 기능
	@RequestMapping(value="/perm/edit", method=RequestMethod.POST)
	public String edit_post() {
		return "redirect:/perm/edit";
	}
	
	// 모달 팝업 구현 예정
//	@RequestMapping(value="/perm/del", method=RequestMethod.GET)
//	public String del() {
//		return "/perm/del";
//	}
	
	//권한 삭제 기능
	@RequestMapping(value="/perm/del", method=RequestMethod.POST)
	public String del_post() {
		return "redirect:/perm/list";
	}
}
