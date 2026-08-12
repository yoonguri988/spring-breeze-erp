package com.sb.erp.eval.service;

import com.sb.erp.eval.dto.response.ReportResponse;

public interface EvalReportService {
    ReportResponse selectLatestByEmpId(long empId);
}
