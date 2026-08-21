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
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.auth.service.AuthUserJwtService;
import com.sb.erp.global.security.ActorContext;
import com.sb.erp.sal.dto.request.SalaryMealAllowancePolicyCreateRequest;
import com.sb.erp.sal.dto.response.SalaryMealAllowancePolicyResponse;
import com.sb.erp.sal.service.SalaryMealAllowancePolicyService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * 식대 정책 관리 (salary-calculation-engine-design.md "API 변경/추가(안)", 선택적).
 * comId를 비우면 전사 공통 기본값(ROOT 전용), comId를 지정하면 해당 회사 전용 정책(그 회사 ADMIN도 가능).
 */
@Tag(name = "급여 산정 - 식대 정책", description = "회사별/전사 공통 월 식대 고정액 정책 조회·등록 API")
@RestController
@RequestMapping("/api/salary-meal-allowance-policy")
@RequiredArgsConstructor
public class SalaryMealAllowancePolicyController {

    private final SalaryMealAllowancePolicyService salaryMealAllowancePolicyService;
    private final AuthUserJwtService authUserJwtService;

    @Operation(summary = "식대 정책 등록 (comId 없으면 전사 공통 기본값, ROOT 전용)")
    @PreAuthorize("hasAnyAuthority('ROOT','ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<SalaryMealAllowancePolicyResponse> register(
            @Valid @RequestBody SalaryMealAllowancePolicyCreateRequest request, Authentication authentication) {
        SalaryMealAllowancePolicyResponse response =
                salaryMealAllowancePolicyService.register(request, actor(authentication));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "식대 정책 조회 (ROOT는 전체, 그 외는 자기 회사 것만)")
    @PreAuthorize("hasAnyAuthority('ROOT','ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<SalaryMealAllowancePolicyResponse>> findAll(Authentication authentication) {
        return ResponseEntity.ok(salaryMealAllowancePolicyService.findAll(actor(authentication)));
    }

    private ActorContext actor(Authentication authentication) {
        return new ActorContext(
                authUserJwtService.getCurrentEmpId(authentication),
                authUserJwtService.getCurrentComId(authentication),
                authUserJwtService.isRoot(authentication));
    }
}
