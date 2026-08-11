package com.sb.erp.dept.service;

import java.util.List;

import com.sb.erp.dept.dto.request.DeptRequest;
import com.sb.erp.dept.dto.request.DeptSearchRequest;
import com.sb.erp.dept.dto.response.DeptResponse;
import com.sb.erp.dept.dto.response.StatsDeptResponse;

public interface DeptService {

	public List<DeptResponse> selectAll();
	
	public List<DeptResponse> selectOrgTree(long companyId);

	public int insert(DeptRequest dto);

	public Object flattenOrgTree(long companyId);

	public int delete(long deptId);

	public int update(DeptRequest dto);

	public DeptResponse selectOneById(long deptId);

	public StatsDeptResponse selectStats(long comId);

	public Object getAncestorChain(long deptId);

	public long countEmployees(long deptId);

	public int softDelete(long deptId);

	public List<DeptResponse> getAllDeptsByComId(long comId);

	public DeptResponse isDuplicateDeptCode(DeptSearchRequest search);
	
	// KJY 조직도 범위 제한
	public List<DeptResponse> selectAncestorDepts(long deptId);

}
