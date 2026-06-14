package com.sb.erp.dao;

import com.sb.erp.dto.AuthDto;
import com.sb.erp.dto.AuthUserDto;
import com.sb.erp.dto.UserDto;

@Mapper
public interface UserMapper {
	public int insertUser(UserDto dto);
	public UserDto findByEmail(String email);
	
	public int insertAuth(AuthDto dto);
	public AuthUserDto readAuth(String email);
}
