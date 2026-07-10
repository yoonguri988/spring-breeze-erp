package com.sb.erp.service;

import java.util.List;

import com.sb.erp.dto.EvalReportDto;

public interface EvalReportService {

	// ─── 조회 (관리자용) ───
	List<EvalReportDto> selectByPeriodId(int periodId);
	EvalReportDto selectByReportId(int reportId);
	int countByPeriodId(int periodId);

	// ─── 조회 (본인용) ───
	EvalReportDto selectMyByPeriod(int periodId);
	List<EvalReportDto> selectMyAll();

	// ─── 생성 ───
	// 회차 전체 리포트 일괄 생성/재생성
	// 반환 규약: 1=성공, -1=회차없음, -2=상태오류(CLOSED/REPORTED만 허용), -3=평가없음
	int generateReports(int periodId);

	// 특정 사원 리포트 개별 재생성
	// 반환 규약: 1=성공, -1=회차없음, -2=상태오류, -3=평가없음
	int regenerateReport(int periodId, int empId);
}
