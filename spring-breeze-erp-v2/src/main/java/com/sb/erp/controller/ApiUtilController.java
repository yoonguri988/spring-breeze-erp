package com.sb.erp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sb.erp.api.BizNoVerifyApi;
import com.sb.erp.dto.BizNoVerifyDto;

@Controller
@RequestMapping("/api/util")
public class ApiUtilController {
	@Autowired BizNoVerifyApi bizNoVerifyApi;
	/**
     * 사업자등록번호 진위확인
     * POST /api/util/bizno/verify
     * body: { 
     *     "bizNo": "123-45-67890", 
     *     "startDt": "2024-01-01", 
     *     "ceoName": "홍길동" 
     * }
     */
	@PostMapping(value="/bizno/verify" , produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String verify(@RequestBody BizNoVerifyDto bizNoVerify) {
        return bizNoVerifyApi.getResponse(bizNoVerify);
	}
}
