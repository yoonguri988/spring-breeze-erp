package com.sb.erp.dept.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.com.service.CompanyService;
import com.sb.erp.dept.dto.DeptDto.DeptRequestDto;
import com.sb.erp.dept.dto.DeptDto.DeptResponseDto;
import com.sb.erp.dept.service.DeptService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name="Department REST API", description = "부서 관리 REST API")
@RestController
@RequestMapping("/api/dept")
@RequiredArgsConstructor
@CrossOrigin(origins="*")
public class DeptController {
	private final DeptService service;
	private final CompanyService comService;
	
	// 부서 목록 GET /api/dept/list
	
	// 부서 등록 폼 GET /api/dept
	
	// 부서 수정 폼 GET /api/dept/{id}
	
	// 부서 수정 PUT /api/dept/{id}
	
	// 부서 삭제 DELETE(?)PUT(?) /api/dept/{id}
	
	// 부서 상세 조회 GET /api/dept/{id}
	
	// 부서 코드 중복 체크 GET /api/depy/check-deptcode
}
