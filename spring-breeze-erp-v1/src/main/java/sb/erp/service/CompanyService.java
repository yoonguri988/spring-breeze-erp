package sb.erp.service;

import java.util.List;

import sb.erp.dto.CompanyDto;

public interface CompanyService {
	public List<CompanyDto> list();
	
	public int add(CompanyDto dto);
	public boolean isDuplicateBizNo(String bizNo);
	
	public CompanyDto selectOneById(int companyId);

	public int update(CompanyDto dto);

	public int delete(int companyId);
}
