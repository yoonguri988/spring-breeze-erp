package sb.erp.dao;

import java.util.List;

import sb.erp.dto.DeptDto;

@ErpMapper
public interface DeptMapper {

	int countActiveDepts(int companyId);

	List<DeptDto> selectAll(int companyId);

	DeptDto selectOneById(int parentId);

	int maxSortOrder(int parentId, int companyId);

}
