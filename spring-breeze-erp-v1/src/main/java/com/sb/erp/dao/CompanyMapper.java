package com.sb.erp.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.sb.erp.dto.CompanyDto;

@Mapper
public interface CompanyMapper {
	public List<CompanyDto> selectAll(@Param("keyword")String keyword, @Param("onepagelist")int onepagelist, @Param("pstarValue")int pstarValue);

	public int insert(CompanyDto dto);
	public CompanyDto selectByBizNo(String bizNo);

	public CompanyDto selectOneById(int comId);

	public int update(CompanyDto dto);

	public int delete(int comId);

	public List<CompanyDto> selectSuggest(@Param("keyword") String keyword);

	public int listTotal(String keyword);

}
