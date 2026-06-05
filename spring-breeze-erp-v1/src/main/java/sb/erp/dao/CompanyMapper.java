package sb.erp.dao;

import java.util.List;

import sb.erp.dto.CompanyDto;

@ErpMapper
public interface CompanyMapper {
	public List<CompanyDto> selectAll();

	public int insert(CompanyDto dto);
	public int countByBizNo(String bizNo);

	public CompanyDto selectOneById(int companyId);

	public int update(CompanyDto dto);

	public int softDelete(int companyId);
}
