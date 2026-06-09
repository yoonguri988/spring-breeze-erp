package sb.erp.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import sb.erp.dto.CompanyDto;

@ErpMapper
public interface CompanyMapper {
	public List<CompanyDto> selectAll(@Param("keyword")String keyword, @Param("onepagelist")int onepagelist, @Param("pstarValue")int pstarValue);

	public int insert(CompanyDto dto);
	public CompanyDto selectByBizNo(String bizNo);

	public CompanyDto selectOneById(int companyId);

	public int update(CompanyDto dto);

	public int delete(int companyId);

	public List<CompanyDto> selectSuggest(@Param("keyword") String keyword);

	public int listTotal(String keyword);

}
