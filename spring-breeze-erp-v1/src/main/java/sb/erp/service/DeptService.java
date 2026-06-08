package sb.erp.service;

import java.util.List;

import sb.erp.dto.DeptDto;

public interface DeptService {

	public List<DeptDto> selectOrgTree(int companyId);

	public int insert(DeptDto dto);

	public Object flattenOrgTree(int companyId);

	public int delete(int deptId);

	public int update(DeptDto dto);

	public DeptDto selectOneById(int deptId);

}
