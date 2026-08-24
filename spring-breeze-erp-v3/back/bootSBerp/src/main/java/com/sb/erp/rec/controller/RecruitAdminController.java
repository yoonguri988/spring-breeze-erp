package com.sb.erp.rec.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.sb.erp.global.oauth2.CustomUserPrincipal;
import com.sb.erp.rec.dto.request.RecruitRequest;
import com.sb.erp.rec.dto.response.RecruitResponse;
import com.sb.erp.rec.service.RecruitService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "채용공고(관리자)", description = "직원용 관리자 API - 공고 CRUD")
@RestController
@RequestMapping("/api/admin/recruit")
@RequiredArgsConstructor
public class RecruitAdminController {

    private final RecruitService recruitService;

    // 공고 목록 — 같은 회사 공고만 조회. ROOT는 전체 조회
    @GetMapping
    public ResponseEntity<Page<RecruitResponse>> getAdminList(
            @RequestParam(required = false) String recStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserPrincipal principal) {

        boolean isRoot = principal.getRoles().contains("ROOT");
        Long comId = isRoot ? null : principal.getComId();

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(recruitService.getAdminList(comId, recStatus, pageable));
    }

    // 공고 상세 — 같은 회사 + ROOT는 전체 접근 허용
    @GetMapping("/{recId}")
    public ResponseEntity<RecruitResponse> getDetail(
            @PathVariable Long recId,
            @AuthenticationPrincipal CustomUserPrincipal principal) {

        RecruitResponse dto = recruitService.getDetail(recId);

        boolean isRoot = principal.getRoles().contains("ROOT");
        if (!isRoot && !dto.getComId().equals(principal.getComId())) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(dto);
    }

    // 공고 등록
    @PostMapping
    public ResponseEntity<Long> create(
            @Valid @RequestBody RecruitRequest req,
            @AuthenticationPrincipal CustomUserPrincipal principal) {

        Long recId = recruitService.insert(req, principal.getComId(), principal.getEmpId());
        return ResponseEntity.status(HttpStatus.CREATED).body(recId);
    }

    // 공고 수정
    @PutMapping("/{recId}")
    public ResponseEntity<Void> update(
            @PathVariable Long recId,
            @Valid @RequestBody RecruitRequest req,
            @AuthenticationPrincipal CustomUserPrincipal principal) {

        recruitService.update(recId, req, principal.getComId());
        return ResponseEntity.ok().build();
    }

    // 공고 삭제
    @DeleteMapping("/{recId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long recId,
            @AuthenticationPrincipal CustomUserPrincipal principal) {

        recruitService.delete(recId, principal.getComId());
        return ResponseEntity.noContent().build();
    }
}