package com.sb.erp.rec.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.rec.dto.response.RecruitResponse;
import com.sb.erp.rec.service.RecruitService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "채용공고(공개)", description = "비회원 지원자용 공개 API - OPEN 공고 조회")
@RestController
@RequestMapping("/public/api/recruit")
@RequiredArgsConstructor
public class RecruitController {

    private final RecruitService recruitService;

    @GetMapping
    public ResponseEntity<Page<RecruitResponse>> getOpenList(
            @RequestParam Long comId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(recruitService.getOpenList(comId, pageable));
    }

    @GetMapping("/{recId}")
    public ResponseEntity<RecruitResponse> getDetail(@PathVariable Long recId) {
        return ResponseEntity.ok(recruitService.getDetail(recId));
    }
}