package com.sb.erp.appr.service;

import java.util.List;

import com.sb.erp.appr.dto.request.ApprAutoDelegationCancelRequest;
import com.sb.erp.appr.dto.response.ApprAutoDelegationResponse;

public interface ApprAutoDelegationService {
	
	public List<ApprAutoDelegationResponse> myDelegation(Long empId);
	public List<ApprAutoDelegationResponse> listByStatus(String delegStatus);
	public void reqeustCancel(Long autoDelegId, Long empId, ApprAutoDelegationCancelRequest req);
	public void approveCancel(Long autoDelegId, Long adminEmpId);
	public void rejectCancel(Long autoDelegId, Long adminEmpId);
}
