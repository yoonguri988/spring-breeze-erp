package com.sb.erp.dao;

import com.sb.erp.dto.PermDto;

@Mapper
public interface PermMapper {

	PermDto selectByEmpId(int empId);

}
