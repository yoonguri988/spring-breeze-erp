package com.sb.erp.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sb.erp.dto.AuthPermDto;
import com.sb.erp.dto.AuthUserDto;

@Mapper
public interface AuthMapper {
	
	// 로그인 시 이메일 기준으로 사원+권한+회사 정보 조회
	AuthUserDto readAuth(@Param("username") String username);

	// 회사 기준 권한 목록 (부여 사원 수 포함)
	List<AuthPermDto> selectAll(int comId);

	// 권한 단건 조회 (수정 화면 진입 시)
	AuthPermDto selectOneById(@Param("autId") int autId, @Param("comId") int comId);
	
	// 권한 등록
	int insert(AuthPermDto dto);

	// 권한 수정
	int update(AuthPermDto dto);

	// 권한 삭제
	int delete(AuthPermDto dto);
	
}
