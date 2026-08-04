package com.sb.erp.com.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sb.erp.com.dto.request.ComRequest;
import com.sb.erp.com.dto.request.CompanySearchRequest;
import com.sb.erp.com.dto.response.ComResponse;
import com.sb.erp.com.dto.response.StatsComResponse;

@Mapper
public interface CompanyMapper {
	public List<ComResponse> selectAll(CompanySearchRequest search);

	public int insert(ComRequest dto)
	;
	public ComResponse selectByBizNo(String bizNo);

	public ComResponse selectOneById(long comId);

	public int update(ComRequest dto);

	public int delete(long comId);

	public List<ComResponse> selectSuggest(@Param("keyword") String keyword);

	public int listTotal(CompanySearchRequest search);

	public StatsComResponse selectStats();

	public ComResponse selectOneByEmpId(long empId);

}
