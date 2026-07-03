package com.sb.erp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.AuthMapper;
import com.sb.erp.dto.AuthPermDto;

@Service
public class AuthServiceImpl implements AuthService {
	@Autowired AuthMapper dao;
	
	@Override
	public List<AuthPermDto> selectAll(Integer comId) {
		return dao.selectAll(comId);
	}

	@Override
	public int insert(AuthPermDto dto) {
		return dao.insert(dto);
	}


	@Override
	public int update(AuthPermDto dto) {
		return dao.update(dto);
	}

	@Override
	public int delete(AuthPermDto dto) {
		// 권한을 가지고 있는 사용자가 있을 경우에는 권한 삭제 불가
		return dao.delete(dto);
	}

}
