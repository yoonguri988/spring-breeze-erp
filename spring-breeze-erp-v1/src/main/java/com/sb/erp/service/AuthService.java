package com.sb.erp.service;

import java.util.List;

import com.sb.erp.dto.AuthPermDto;

public interface AuthService {

	List<AuthPermDto> selectAll(Integer comId);

	int insert(AuthPermDto dto);

	AuthPermDto selectOneById(int autId);

	int update(AuthPermDto dto);

	int delete(AuthPermDto dto);

}
