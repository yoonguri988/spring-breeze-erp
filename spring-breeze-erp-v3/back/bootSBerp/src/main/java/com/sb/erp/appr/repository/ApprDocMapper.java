package com.sb.erp.appr.repository;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sb.erp.appr.dto.request.ApprDocSearchCondition;
import com.sb.erp.appr.dto.response.ApprDocInitResponse;
import com.sb.erp.appr.dto.response.ApprDocSummaryResponse;
import com.sb.erp.appr.dto.response.ApprFormResponse;
import com.sb.erp.appr.dto.response.ApprLineResponse;

@Mapper
public interface ApprDocMapper {
	
	// 작성하려는 사용자의 회사 양식 목록
	public List<ApprFormResponse> findForm(@Param("comId") long comId);
	
	// 결재 문서 작성하려는 사용자 인적사항
	public ApprDocInitResponse initResponse(@Param("empId") long empId);
	
	// 대시보드용 통계 (이거.. 관리자쪽 파트 작성하다가 수정할수도있음)
	public Map<String, Object> selectDocCnt(@Param("empId") long empId);
	
	// 내가 결재 했던 모든 문서
	public List<ApprDocSummaryResponse> selectMyHistoryDocs(ApprDocSearchCondition condition);
	public int selectMyHistoryDocsCnt(ApprDocSearchCondition condition);
	
	// 내가 결재 해야 할 모든 문서
	public List<ApprDocSummaryResponse> selectMyTodoDocs(ApprDocSearchCondition condition);
	public int selectMyTodoDocsCnt(ApprDocSearchCondition condition);
	
	
	// 기안자 상사들 목록 조회
	public List<ApprLineResponse> approversByEmpId(@Param("empId") long empId);
	
	// 결재선 지정용 - 부서 내 직원 목록
	public List<ApprLineResponse> selectDeptEmpsForLines(@Param("deptId") long deptId);
	
	// 결재선 지정 가능 인원수
	public int cntApprovers(@Param("deptId") long deptId,
							@Param("empId") long empId);
}
