package com.sb.erp.dao;

import org.apache.ibatis.annotations.Param;

import com.sb.erp.dto.AuthUserDto;

@Mapper
public interface AuthMapper {
	AuthUserDto readAuth(@Param("username") String username);
}
