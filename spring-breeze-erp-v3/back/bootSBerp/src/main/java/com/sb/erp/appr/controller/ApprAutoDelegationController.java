package com.sb.erp.appr.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.appr.dto.response.ApprAutoDelegationResponse;
import com.sb.erp.appr.service.ApprAutoDelegationService;
import com.sb.erp.global.oauth2.CustomUserPrincipal;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "위임전결", description = "휴가/출장 연동 위임전결 조회 및 취소 API")
@RestController
@RequestMapping("/appr/delegations")
@RequiredArgsConstructor
public class ApprAutoDelegationController {
	
	private final ApprAutoDelegationService autoService;
	
	@Operation(summary = "내 위임전결 현황", description = "본인이 위임한 위임전결 목록 조회")
	@GetMapping("/my")
	public ResponseEntity<List<ApprAutoDelegationResponse>> myDelegations(
			@AuthenticationPrincipal CustomUserPrincipal principal
	) {
		return ResponseEntity.ok(autoService.myDelegation(principal.getEmpId()));
	}
}
