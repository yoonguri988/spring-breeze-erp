package com.sb.erp.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.sb.erp.dto.DeptDto;

@Mapper
public interface DeptMapper {

	int countActiveDepts(int companyId);

	List<DeptDto> selectAll(int companyId);

	DeptDto selectOneById(int deptId);

	int maxSortOrder(@Param("parentId")int parentId, @Param("companyId")int companyId);

	int insert(DeptDto dto);

	int delete(int deptId);

	int countChildren(int deptId);

	int update(DeptDto dto);

	List<Integer> selectAllChildIds(int deptId);

}
