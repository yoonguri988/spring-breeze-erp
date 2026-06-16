package com.sb.erp.service;

import java.util.List;

import com.sb.erp.dto.ApprFormDto;
import com.sb.erp.dto.ApprFormSearchDto;
import com.sb.erp.dto.CompanySearchDto;

public interface ApprService {
	
	// 공통 파트
	public int getCompanyIdByName(String name);
	public List<CompanySearchDto> searchCompany(String keyword);
	
	// 결제 양식 파트
	public ApprFormDto selectFormAll();
	public int insertForm(ApprFormDto dto);
	public int updateForm(ApprFormDto dto);
	public int deleteFrom(ApprFormDto dto);
	public ApprFormDto selectFromList(ApprFormSearchDto dto); 
}
