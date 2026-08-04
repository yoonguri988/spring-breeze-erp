package com.sb.erp.appr.service;

import java.util.List;
import java.util.Map;

import com.sb.erp.appr.dto.ApprDocDto;
import com.sb.erp.appr.dto.ApprDocInitResponseDto;
import com.sb.erp.appr.dto.ApprFormDto;
import com.sb.erp.appr.dto.ApprLineDto;
import com.sb.erp.dept.dto.DeptDto;

public interface ApprDocService {
	
	// 문서 작성 파트
	public List<ApprFormDto> findForm(ApprDocDto dto);
	public ApprDocInitResponseDto initResponse(ApprDocDto dto);
	public int insertDoc(ApprDocDto dto);
	public ApprFormDto getForm(Map<String,Object> map);
	
	// 문서 조회,처리 파트
	public Map<String, Object> selectDocCnt(ApprDocDto dto);
	public List<Map<String, Object>> selectMyHistoryDocs(ApprDocDto dto);
	public List<Map<String, Object>> selectMyTodoDocs(ApprDocDto dto);
	public ApprDocDto selectDocDetail(int docId);
	
	// 결재선 관련 파트
	public List<ApprLineDto> approversByEmpId(ApprDocDto dto);
	public boolean insertLines(ApprDocDto dto);
	public List<ApprLineDto> selectLinesByDocId(int docId);
	public void processLine(int docId, int empId, String action);
	public List<ApprLineDto> selectDeptEmpsForLines(int deptId);
	public List<DeptDto> cntApprovers(int deptId, int empId);
	
	// 페이징
	public int selectMyHistoryDocsCnt(ApprDocDto dto);
	public int selectMyTodoDocsCnt(ApprDocDto dto);
}
