package com.sb.erp.eval.service;

import com.sb.erp.eval.dto.response.ReportResponse;
import com.sb.erp.eval.repository.EvalReportMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EvalReportServiceImpl implements EvalReportService {
    private final EvalReportMapper evalReportMapper;

    @Override
    public ReportResponse selectLatestByEmpId(long empId) {
        return evalReportMapper.selectLatestByEmpId(empId, 1L);
    }
}
