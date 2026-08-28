package com.sb.erp.dashboard.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.dashboard.admin.dto.AdminDashboardSummaryResponse;
import com.sb.erp.dashboard.admin.service.AdminDashboardService;
import com.sb.erp.global.oauth2.CustomUserPrincipal;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "관리자 대시보드", description = "관리자 대시보드 요약 API")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;
    
    @Operation(
        summary = "관리자 대시보드 통합 요약",
        description = "로그인 관리자의 대시보드에 필요한 모든 요약 데이터 조회"
    )
    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
    	
    	// ── 권한 체크: ROLE_ADMIN 또는 ROOT만 접근 가능 ──
        List<String> roles = principal.getRoles();
        boolean isAdmin = roles != null
                && (roles.contains("ROLE_ADMIN") || roles.contains("ROOT"));

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "관리자만 접근할 수 있습니다."));
        }

        Long empId = principal.getEmpId();
        Long comId = principal.getComId();

        AdminDashboardSummaryResponse summary =
                adminDashboardService.getSummary(empId, comId);

        return ResponseEntity.ok(summary);
    }
}
