package com.sb.erp.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.ProjectMemberDto;

@Mapper
public interface ProjectMemberMapper {
	//프로젝트 멤버 추가
	public int insert(ProjectMemberDto dto);
	
	//프로젝트 멤버 삭제
	public int delete(int pm_id);
	
	//프로젝트 멤버 조회
	public List<ProjectMemberDto> select(int pro_id);
	
	//프로젝트 멤버 이름 조회
	public List<ProjectMemberDto> selectByproject(int projectProId);
	
	//태스크 등록-멤버 이름
	public ProjectMemberDto selectOne(int pmId);
	
	//사원 이름,번호 조회
	public List<EmpDto> searchEmpForProject(@Param("comId") int comId, @Param("keyword") String keyword);
}