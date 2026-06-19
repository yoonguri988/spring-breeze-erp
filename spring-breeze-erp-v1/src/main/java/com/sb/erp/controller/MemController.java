package com.sb.erp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/mem")
public class MemController {

    // 1. 로그인 페이지 호출 (GET)
    @GetMapping("/login")
    public String loginForm() {
        // WEB-INF/views/mem/login.jsp 파일이 있어야 합니다.
        return "mem/login"; 
    }
    
    // 2. 필요시 회원가입 페이지 호출
    @GetMapping("/join")
    public String joinForm() {
        return "mem/join";
    }
}