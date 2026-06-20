package com.sb.erp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.ProjectMemberMapper;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.ProjectMemberDto;

@Service
public class ProjectMemberServiceImpl implements ProjectMemberService{
	@Autowired ProjectMemberMapper dao;
	
	@Override public int insert(ProjectMemberDto dto) {  return dao.insert(dto); }

	@Override public int delete(int pm_id) {  return dao.delete(pm_id); }

	@Override public List<ProjectMemberDto> select(int pro_id) { return dao.select(pro_id); }

	@Override public List<ProjectMemberDto> selectByproject(int project_pro_id) {  return dao.selectByproject(project_pro_id); }

	@Override public ProjectMemberDto selectOne(int pmId) {  return dao.selectOne(pmId); }

	@Override public List<EmpDto> searchEmpForProject(int comId, String keyword) { return dao.searchEmpForProject(comId, keyword); }

}
