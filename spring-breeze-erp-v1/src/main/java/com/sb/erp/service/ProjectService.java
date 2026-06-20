package com.sb.erp.service;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.sb.erp.dto.ProjectDto;

public interface ProjectService {
	public int insert(ProjectDto dto);
	public List<ProjectDto> selectByStatus(String Dto);
	public ProjectDto select(int pro_id);
	public int delete(int pro_id);
	public int edit(ProjectDto dto);
	public ProjectDto editView(int pro_id);
	
	public List<ProjectDto> select10(int pstartno);
	public int selectCnt();
	
	List<ProjectDto> selectByPeriod(String startDate, String endDate);
	public List<ProjectDto> searchByKeyword(@Param("keyword") String keyword);
	
}
