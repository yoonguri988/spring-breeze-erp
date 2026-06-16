package com.sb.erp.dao;

import java.util.List;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.EmpSearchDto;

@Mapper
public interface EmpMapper {

	// 필요한 메서드 선언
	// 사원 목록 조회
	public List<EmpDto> selectAll();
	
	// 상세조회
	public EmpDto selectByEmpId(int empId);
	
	// 검색 필터
	public List<EmpDto> search(EmpSearchDto dto);
	
}
