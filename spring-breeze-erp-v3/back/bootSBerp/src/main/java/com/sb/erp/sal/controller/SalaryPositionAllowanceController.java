package com.sb.erp.sal.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.auth.service.AuthUserJwtService;
import com.sb.erp.global.security.ActorContext;
import com.sb.erp.sal.dto.request.SalaryPositionAllowanceCreateRequest;
import com.sb.erp.sal.dto.response.SalaryPositionAllowanceResponse;
import com.sb.erp.sal.service.SalaryPositionAllowanceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/** 직책별 수당 정책 관리 (salary-calculation-engine-design.md "API 변경/추가(안)"). ROOT가 아니면 소속 회사로 스코프 제한. */
@Tag(name = "급여 산정 - 직책수당 정책", description = "직급코드(position)별 월 지급 수당 정책 조회·등록 API")
@RestController
@RequestMapping("/api/salary-position-allowances")
@RequiredArgsConstructor
public class SalaryPositionAllowanceController {

    private final SalaryPositionAllowanceService salaryPositionAllowanceService;
    private final AuthUserJwtService authUserJwtService;

    @Operation(summary = "직책수당 정책 등록 (기존 유효 정책은 자동 이력 처리)")
    @PreAuthorize("hasAnyAuthority('ROOT','ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<SalaryPositionAllowanceResponse> register(
            @Valid @RequestBody SalaryPositionAllowanceCreateRequest request, Authentication authentication) {
        SalaryPositionAllowanceResponse response = salaryPositionAllowanceService.register(request, actor(authentication));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "직책수당 정책 전체 조회 (이력 포함). ROOT는 comId 파라미터로 특정 회사 조회 가능")
    @PreAuthorize("hasAnyAuthority('ROOT','ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<SalaryPositionAllowanceResponse>> findAll(
            @RequestParam(required = false) Long comId, Authentication authentication) {
        return ResponseEntity.ok(salaryPositionAllowanceService.findAll(comId, actor(authentication)));
    }

    private ActorContext actor(Authentication authentication) {
        return new ActorContext(
                authUserJwtService.getCurrentEmpId(authentication),
                authUserJwtService.getCurrentComId(authentication),
                authUserJwtService.isRoot(authentication));
    }
}
