package com.sb.erp.dao;

import java.util.HashMap;
import java.util.List;

import com.sb.erp.dto.ProjectDto;

@Mapper
public interface ProjectMapper {
	public int insert(ProjectDto dto);
	public List<ProjectDto> selectByStatus(String pro_status);
	public ProjectDto select(int pro_id);
	public int delete(int pro_id);
	public int update(ProjectDto dto);
	
	/* paging */
	public List<ProjectDto> select10(HashMap<String,Integer> map);
	public int selectCnt();
	
}
