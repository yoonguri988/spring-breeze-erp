package com.sb.erp.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.ProjectMapper;
import com.sb.erp.dto.ProjectDto;
import com.sb.erp.dto.ProjectSearchDto;

@Service
public class ProjectServiceImpl implements ProjectService{
	@Autowired ProjectMapper dao;

	//프로젝트 등록
	@Override public int insert(ProjectDto dto) {  return dao.insert(dto); }

	//상태별 조회
	@Override public List<ProjectDto> selectByStatus(String pro_status) 
	{  return dao.selectByStatus(pro_status); }

	//프로젝트 상세보기
	@Override public ProjectDto select(int pro_id) {  return dao.select(pro_id); }
	
	//프로젝트 삭세
	@Override public int delete(int pro_id) {  return dao.delete(pro_id); }
	
	//프로젝트 수정
	@Override public int edit(ProjectDto dto) {  return dao.update(dto); }
	
	//프로젝트 수정뷰
	@Override public ProjectDto editView(int pro_id) {  return dao.select(pro_id); }

	/*paging*/
	@Override public List<ProjectDto> selectAll(ProjectSearchDto search) {
		search.setPstartno((search.getPstartno()-1) * search.getOnepagelist());
		return dao.selectAll(search);
	}
	
    @Override public int selectCnt(ProjectSearchDto search) { return dao.selectCnt(search); }
    
    //기간조회
	@Override public List<ProjectDto> selectByPeriod(String startDate, String endDate) {  return dao.selectByPeriod(startDate, endDate); }
	
	//프로젝트명 검색
	@Override public List<ProjectDto> searchByKeyword(String keyword) {  return dao.searchByKeyword(keyword); } 
}
