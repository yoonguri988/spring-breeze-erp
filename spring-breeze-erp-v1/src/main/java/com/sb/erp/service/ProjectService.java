package com.sb.erp.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.sb.erp.dto.ProjectDto;
import com.sb.erp.dto.ProjectSearchDto;

public interface ProjectService {
	//프로젝트 등록
	public int insert(ProjectDto dto);
	
	//프로젝트 상태별 리스트
	public List<ProjectDto> selectByStatus(String Dto);
	
	//프로젝트 상세보기
	public ProjectDto select(int pro_id);
	
	//프로젝트 삭제
	public int delete(int pro_id);
	
	//프로젝트 수정
	public int edit(ProjectDto dto);
	
	//프로젝트 수정뷰
	public ProjectDto editView(int pro_id);
	
	/* paging */
	public List<ProjectDto> selectAll(ProjectSearchDto search);
	public int selectCnt(ProjectSearchDto search);
	
	//기간조회
	public List<ProjectDto> selectByPeriod(String startDate, String endDate);
	
	//프로젝트명 조회
	public List<ProjectDto> searchByKeyword(@Param("keyword") String keyword);
	
	
}
