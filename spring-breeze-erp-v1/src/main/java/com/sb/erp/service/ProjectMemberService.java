package com.sb.erp.service;

import java.util.List;

import com.sb.erp.dto.ProjectMemberDto;

public interface ProjectMemberService {
	public List<ProjectMemberDto> select(int pro_id);
	public int insert(ProjectMemberDto dto);
	public int delete(int pm_id);
}
