package com.sb.erp.appr.service;

import com.sb.erp.appr.dto.request.ApprFormDelegationConfigRequest;
import com.sb.erp.appr.dto.response.ApprFormDelegationConfigResponse;

public interface ApprFormDelegationConfigService {
	
	public Long save(ApprFormDelegationConfigRequest req);
	public ApprFormDelegationConfigResponse getByForm(Long forId, Long forVersion);

}
