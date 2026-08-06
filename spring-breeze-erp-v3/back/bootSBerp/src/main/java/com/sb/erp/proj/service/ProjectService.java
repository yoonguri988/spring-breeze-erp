package com.sb.erp.proj.service;

import java.util.List;

import com.sb.erp.proj.dto.request.ProjRequest;
import com.sb.erp.proj.dto.request.ProjectSearchRequest;
import com.sb.erp.proj.dto.response.ProjResponse;
import com.sb.erp.proj.dto.response.ProjectAnalysisResponse;
import com.sb.erp.week.dto.response.WeeklyReportResponse;

public interface ProjectService {
	//프로젝트 등록
	public int insert(ProjRequest dto);

	//프로젝트 상세보기
	public ProjResponse select(int proId);
	
	//프로젝트 삭제
	public int delete(int proId);
	
	//프로젝트 수정
	public int edit(ProjRequest dto);
	
	//프로젝트 수정뷰
	public ProjResponse editView(int proId);
	
	/* paging */
	public List<ProjResponse> selectAll(ProjectSearchRequest search);
	public int selectCnt(ProjectSearchRequest search);

	//Ai 분석 결과
	public ProjectAnalysisResponse projectAnalysis(Integer proId);
	public String analyzeProject(Integer proId);
	
	//주간 보고서용-팀장용
	public WeeklyReportResponse weeklyReport(Integer proId);
	
	//주간 보고서용으로 가져올 프로젝트들
	public List<Integer>selectActiveProjectIds();
}
