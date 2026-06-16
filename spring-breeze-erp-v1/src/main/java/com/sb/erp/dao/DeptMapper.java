package com.sb.erp.dao;

import java.util.List;
import com.sb.erp.dto.DeptDto;

@Mapper
public interface DeptMapper {

	// 필요한 메서드 선언

	// 부서 불러오기
	public List<DeptDto> selectAll();
}
