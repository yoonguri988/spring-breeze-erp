package com.sb.erp.appr.repository;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sb.erp.appr.dto.ApprDocDto;
import com.sb.erp.appr.dto.ApprDocInitResponseDto;
import com.sb.erp.appr.dto.ApprFormDto;
import com.sb.erp.appr.dto.ApprLineDto;

@Mapper
public interface ApprDocMapper {
	
	// 작성하려는 사용자의 회사 양식 목록
	public List<ApprFormDto> findForm(ApprDocDto dto);
	
	// 결재 문서 작성하려는 사용자 인적사항
	public ApprDocInitResponseDto initResponse(ApprDocDto dto);
	
	// 대시보드용 통계 (이거.. 관리자쪽 파트 작성하다가 수정할수도있음)
	public Map<String, Object> selectDocCnt(ApprDocDto dto);
	
	// 내가 결재 했던 모든 문서
	public List<Map<String, Object>> selectMyHistoryDocs(ApprDocDto dto);
	public int selectMyHistoryDocsCnt(ApprDocDto dto);
	
	// 내가 결재 해야 할 모든 문서
	public List<Map<String, Object>> selectMyTodoDocs(ApprDocDto dto);
	public int selectMyTodoDocsCnt(ApprDocDto dto);
	
	
	// 기안자 상사들 목록 조회
	public List<ApprLineDto> approversByEmpId(ApprDocDto dto);
	
	// 결재선 지정용 - 부서 내 직원 목록
	public List<ApprLineDto> selectDeptEmpsForLines(int deptId);
	
	// 결재선 지정 가능 인원수
	public int cntApprovers(@Param("deptId") int deptId,
							@Param("empId") int empId);
}
