package com.sb.erp.service;

import java.util.List;

import com.sb.erp.dto.CompanyDto;

public interface CompanyService {
	public List<CompanyDto> list(String keyword, int onepagelist, int pstarValue);
	
	public int add(CompanyDto dto);
	public CompanyDto isDuplicateBizNo(String bizNo);
	
	public CompanyDto selectOneById(int comId);

	public int update(CompanyDto dto);

	public int delete(int comId);

	public List<CompanyDto> getSuggest(String keyword);

	public int listTotal(String keyword);
}
