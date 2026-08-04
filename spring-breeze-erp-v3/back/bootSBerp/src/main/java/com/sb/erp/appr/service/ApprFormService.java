package com.sb.erp.appr.service;

import java.util.List;

import com.sb.erp.appr.dto.ApprFormDto;
import com.sb.erp.appr.dto.ApprFormSearchDto;
import com.sb.erp.com.dto.CompanySearchDto;

public interface ApprFormService { 
	
	// 공통 파트
	public String getCompanyName(int comId);
	public List<CompanySearchDto> searchCompany(String keyword);
	// 페이징 기능
	public int listFormCnt(ApprFormSearchDto dto);
	
	// 양식 작성 파트
	public ApprFormDto selectFormAll(ApprFormDto dto);
	public int insertForm(ApprFormDto dto);
	public int updateForm(ApprFormDto dto);
	public int deleteForm(ApprFormDto dto);
	public List<ApprFormDto> selectFormList(ApprFormSearchDto dto); 
	public String findByCode(ApprFormDto dto);
}
