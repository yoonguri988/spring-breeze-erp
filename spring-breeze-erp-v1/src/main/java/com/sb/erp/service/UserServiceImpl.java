package com.sb.erp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.UserMapper;
import com.sb.erp.dto.AuthDto;
import com.sb.erp.dto.AuthUserDto;
import com.sb.erp.dto.UserDto;

@Service
public class UserServiceImpl implements UserService {
	@Autowired UserMapper dao;
	@Autowired  @Qualifier("passwordEncoder") PasswordEncoder  pwencoder;

	// 회원가입
	@Override
	public int insertUser(UserDto dto) {
		dto.setUser_pass(pwencoder.encode(dto.getUser_pass()));
		return dao.insertUser(dto);
	}
	
	// 이메일로 테이블 정보 가져오기
	@Override
	public UserDto findByEmail(String email) {
		return dao.findByEmail(email);
	}

	// 권한 부여
	@Override
	public int insertAuth(AuthDto dto) {
		return dao.insertAuth(dto);
	}

	// 권한 읽어오기
	@Override
	public AuthUserDto readAuth(String email) {
		return dao.readAuth(email);
	}
	
	
}
