package com.sb.erp.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.ProjectMapper;
import com.sb.erp.dto.ProjectDto;

@Service
public class ProjectServiceImpl implements ProjectService{
	@Autowired ProjectMapper dao;

	@Override public int insert(ProjectDto dto) {  return dao.insert(dto); }

	@Override public List<ProjectDto> selectByStatus(String pro_status) 
	{  return dao.selectByStatus(pro_status); }

	@Override public ProjectDto select(int pro_id) {  return dao.select(pro_id); }

	@Override public int delete(int pro_id) {  return dao.delete(pro_id); }

	@Override public int edit(ProjectDto dto) {  return dao.update(dto); }

	@Override public ProjectDto editView(int pro_id) {  return dao.select(pro_id); }

	/*paging*/
	@Override public List<ProjectDto> select10(int pstartno) {
		HashMap<String,Integer> map = new HashMap<>();
		map.put("start", (pstartno-1)*10);
		map.put("end", 10);
		return dao.select10(map); }

	@Override public int selectCnt() {  
		return dao.selectCnt(); }
	
	
}
