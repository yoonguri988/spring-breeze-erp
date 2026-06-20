package com.sb.erp.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.sb.erp.dto.ProjectDto;

@Mapper
public interface ProjectMapper {
	// 프로젝트 등록
	public int insert(ProjectDto dto);
	
	//프로젝트 상태별 리스트
	public List<ProjectDto> selectByStatus(String pro_status);
	
	//프로젝트 상세보기
	public ProjectDto select(int pro_id);
	
	//프로젝트 삭제
	public int delete(int pro_id);
	
	//프로젝트 수정
	public int update(ProjectDto dto);
	
	/* paging */
	public List<ProjectDto> select10(HashMap<String,Integer> map);
	public int selectCnt();
	
	//기간조회
	public List<ProjectDto> selectByPeriod(@Param("startDate") String startDate, @Param("endDate") String endDate);
	
	//프로젝트명 검색
	public List<ProjectDto> searchByKeyword(@Param("keyword") String keyword);
}
