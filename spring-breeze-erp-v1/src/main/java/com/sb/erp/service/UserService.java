package com.sb.erp.service;

import com.sb.erp.dto.AuthDto;
import com.sb.erp.dto.AuthUserDto;
import com.sb.erp.dto.UserDto;

public interface UserService {
	public int insertUser(UserDto dto);
	public UserDto findByEmail(String email);
	
	public int insertAuth(AuthDto dto);
	public AuthUserDto readAuth(String email);
}
