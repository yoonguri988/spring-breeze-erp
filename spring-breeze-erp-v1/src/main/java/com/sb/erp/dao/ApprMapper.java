package com.sb.erp.dao;


import java.util.HashMap;
import java.util.List;

import com.sb.erp.dto.ApprFormDto;
import com.sb.erp.dto.ApprFormSearchDto;
import com.sb.erp.dto.CompanySearchDto;

@Mapper
public interface ApprMapper {
	
	// 공통
	public List<CompanySearchDto> searchCompany(String keyword);
	public int getCompanyIdByName(String name);
	
	// 페이징 기능
	public List<ApprFormDto> list10Form(HashMap<String, Integer> map);
	public int listFormCnt();
	
	// 양식 파트
	public ApprFormDto selectFormAll(int forId);
	public int insertForm(ApprFormDto dto);
	public int updateForm(ApprFormDto dto);
	public int deleteFrom(ApprFormDto dto);
	public List<ApprFormDto> selectFormList(ApprFormSearchDto dto);
	
	
}
