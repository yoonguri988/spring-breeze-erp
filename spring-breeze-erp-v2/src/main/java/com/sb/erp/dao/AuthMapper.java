package com.sb.erp.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.sb.erp.dto.AuthPermDto;
import com.sb.erp.dto.AuthUserDto;

@Mapper
public interface AuthMapper {
	AuthUserDto readAuth(@Param("username") String username);

	List<AuthPermDto> selectAll(Integer comId);

	int insert(AuthPermDto dto);

	AuthPermDto selectOneById(int autId);

	int update(AuthPermDto dto);

	int delete(AuthPermDto dto);
}
