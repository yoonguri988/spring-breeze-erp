package com.sb.erp.apct.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.sb.erp.apct.dto.request.ApplicantRequest;
import com.sb.erp.apct.dto.response.MyApplicationResponse;
import com.sb.erp.apct.service.ApplicantService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "지원자(공개)", description = "지원자용 공개 API - 지원서 제출, 내 지원현황 조회")
@RestController
@RequestMapping("/public/api/applicant")
@RequiredArgsConstructor
public class ApplicantController {

    private final ApplicantService applicantService;

    // 지원서 제출 - 소셜로그인 필요
    @PostMapping("/apply")
    public ResponseEntity<Long> apply(@Valid @RequestBody ApplicantRequest req,
                                       Authentication authentication) {
        Long apctId = applicantService.apply(req, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(apctId);
    }

    // 내 지원현황 조회 - 소셜로그인 필요
    @GetMapping("/me")
    public ResponseEntity<List<MyApplicationResponse>> getMyApplications(Authentication authentication) {
        return ResponseEntity.ok(applicantService.getMyApplications(authentication));
    }
}