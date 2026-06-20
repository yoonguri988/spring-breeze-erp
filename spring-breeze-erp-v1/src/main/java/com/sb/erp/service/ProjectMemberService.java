package com.sb.erp.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.ProjectMemberDto;

public interface ProjectMemberService {
	public List<ProjectMemberDto> select(int pro_id);
	public int insert(ProjectMemberDto dto);
	public int delete(int pm_id);
	public List<ProjectMemberDto> selectByproject(int project_pro_id);
	public ProjectMemberDto selectOne(int pmId);
	public List<EmpDto> searchEmpForProject(@Param("comId") int comId, @Param("keyword") String keyword);
}
