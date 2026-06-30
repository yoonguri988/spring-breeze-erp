package com.sb.erp.dao;

import com.sb.erp.dto.AuthPermDto;

@Mapper
public interface PermMapper {

	AuthPermDto selectByEmpId(int empId);

}
