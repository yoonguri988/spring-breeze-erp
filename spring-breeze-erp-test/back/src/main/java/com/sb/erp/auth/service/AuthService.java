package com.sb.erp.auth.service;

import org.apache.ibatis.annotations.Param;

import com.sb.erp.auth.dto.response.AuthUserResponse;

public interface AuthService {
	//  로그인 시 이메일 기준으로 사원+권한+회사 정보 조회
	AuthUserResponse readAuth(@Param("username") String username);
}
