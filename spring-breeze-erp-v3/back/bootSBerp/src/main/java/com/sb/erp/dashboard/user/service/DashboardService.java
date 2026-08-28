package com.sb.erp.dashboard.user.service;

import com.sb.erp.dashboard.user.dto.response.DashboardSummaryResponse;

public interface DashboardService {
	public DashboardSummaryResponse getSummary(Long empId, Long comId);
}
