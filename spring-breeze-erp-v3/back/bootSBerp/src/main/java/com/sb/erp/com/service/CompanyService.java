package com.sb.erp.com.service;

import java.util.List;

import com.sb.erp.com.dto.request.ComRequest;
import com.sb.erp.com.dto.request.CompanySearchRequest;
import com.sb.erp.com.dto.response.ComResponse;
import com.sb.erp.com.dto.response.StatsComResponse;

public interface CompanyService {
	public List<ComResponse> list(CompanySearchRequest search);
	
	public int add(ComRequest dto);
	
	public ComResponse isDuplicateBizNo(String bizNo);
	
	public ComResponse selectOneById(long comId);

	public int update(ComRequest dto);

	public int delete(long comId);

	public List<ComResponse> getSuggest(String keyword);

	public int listTotal(CompanySearchRequest search);

	public StatsComResponse selectStats();

	public ComResponse selectOneByEmpId(long empId);
}
