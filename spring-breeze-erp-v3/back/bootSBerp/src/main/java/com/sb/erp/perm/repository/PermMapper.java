package com.sb.erp.perm.repository;

import org.apache.ibatis.annotations.Mapper;

import com.sb.erp.perm.dto.response.PermResponse;

@Mapper
public interface PermMapper {

	PermResponse selectByEmpId(long empId);

}
