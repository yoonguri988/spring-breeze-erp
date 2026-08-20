package com.sb.erp.sal.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.auth.service.AuthUserJwtService;
import com.sb.erp.global.security.ActorContext;
import com.sb.erp.sal.dto.request.SalaryStandardCreateRequest;
import com.sb.erp.sal.dto.request.SalaryStandardUpdateRequest;
import com.sb.erp.sal.dto.response.SalaryStandardResponse;
import com.sb.erp.sal.service.SalaryStandardService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/** 6. 급여기준 관리 */
@Tag(name = "급여 기준 관리", description = "직원별 급여기준(기본급/연봉계약/적용기간) 등록·조회·수정·삭제 API")
@RestController
@RequestMapping("/api/salstd")
@RequiredArgsConstructor
public class SalaryStandardController {

    private final SalaryStandardService salaryStandardService;
    private final AuthUserJwtService authUserJwtService;

    /** 6-1 급여기준등록 */
    @Operation(summary = "급여기준 등록")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<SalaryStandardResponse> register(@Valid @RequestBody SalaryStandardCreateRequest request,
                                                             Authentication authentication) {
        SalaryStandardResponse response = salaryStandardService.register(request, actor(authentication));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** 6-2 급여기준조회(전체) - 직원명/부서/직급 필터, 페이지네이션. ROOT가 아니면 소속 회사로 스코프 제한 */
    @Operation(summary = "급여기준 전체 조회")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<Page<SalaryStandardResponse>> findAll(
            @RequestParam(required = false) String empName,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String position,
            Authentication authentication,
            Pageable pageable) {
        return ResponseEntity.ok(salaryStandardService.findAll(empName, department, position, actor(authentication), pageable));
    }

    /** 6-3 급여기준조회(본인) */
    @Operation(summary = "본인 급여기준 조회")
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<SalaryStandardResponse> findMyCurrent(Authentication authentication) {
        return ResponseEntity.ok(salaryStandardService.findMyCurrent(authUserJwtService.getCurrentEmpId(authentication)));
    }

    /** 6-4 급여기준수정 */
    @Operation(summary = "급여기준 수정 (이전 값은 이력으로 보존)")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<SalaryStandardResponse> update(@PathVariable Long id,
                                                           @Valid @RequestBody SalaryStandardUpdateRequest request,
                                                           Authentication authentication) {
        SalaryStandardResponse response = salaryStandardService.update(id, request, actor(authentication));
        return ResponseEntity.ok(response);
    }

    /** 6-5 급여기준삭제 */
    @Operation(summary = "급여기준 삭제")
    @PreAuthorize("hasAnyAuthority('ROOT','ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        salaryStandardService.delete(id, actor(authentication));
        return ResponseEntity.noContent().build();
    }

    private ActorContext actor(Authentication authentication) {
        return new ActorContext(
                authUserJwtService.getCurrentEmpId(authentication),
                authUserJwtService.getCurrentComId(authentication),
                authUserJwtService.isRoot(authentication));
    }
}
