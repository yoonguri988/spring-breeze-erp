package com.sb.erp.dao;

import java.util.List;

import com.sb.erp.dto.ProjectMemberDto;

@Mapper
public interface ProjectMemberMapper {

	public int insert(ProjectMemberDto dto);
	public int delete(int pm_id);
	public List<ProjectMemberDto> select(int pro_id);
	public List<ProjectMemberDto> selectByproject(int projectProId);
	public ProjectMemberDto selectOne(int pmId);
}