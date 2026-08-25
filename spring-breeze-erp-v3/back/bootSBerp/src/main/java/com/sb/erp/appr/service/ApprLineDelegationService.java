package com.sb.erp.appr.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sb.erp.appr.dto.request.ApprLineDelegationRequest;
import com.sb.erp.appr.dto.request.ApprLineRequestSearchCondition;
import com.sb.erp.appr.dto.response.ApprLineDelegationResponse;

public interface ApprLineDelegationService {
	
	public Long createRequest(ApprLineDelegationRequest req, Long reqEmpId);
	public List<ApprLineDelegationResponse> myRequests(Long empId);
	public List<ApprLineDelegationResponse> pendingRequests();
	public void approve(Long reqId, Long adminEmpId);
	public void reject(Long reqId, Long adminEmpId);
	
	// 관리자 콘솔 - 전체 처리 이력 조회
	public Page<ApprLineDelegationResponse> searchHistory(ApprLineRequestSearchCondition cond, Pageable pageable);
}
