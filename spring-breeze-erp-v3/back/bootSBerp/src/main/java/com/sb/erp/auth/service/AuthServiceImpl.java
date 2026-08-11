package com.sb.erp.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.auth.dto.response.AuthUserResponse;
import com.sb.erp.auth.repository.AuthMapper;


@Service
public class AuthServiceImpl implements AuthService {
	@Autowired AuthMapper dao;

	@Override
	public AuthUserResponse readAuth(String username) {
		AuthUserResponse user = dao.readAuth(username);
		if (user == null) {
			throw new IllegalArgumentException("사용자를 찾을 수 없습니다: " + username);
		}
		return user;
	}
}
