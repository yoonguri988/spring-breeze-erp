package com.sb.erp.perm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.perm.repository.PermMapper;
import com.sb.erp.perm.dto.AuthPermDto;

@Service
public class PermServiceImpl implements PermService {
	@Autowired PermMapper dao;
	
	@Override
	public AuthPermDto selectByEmpId(int empId) {
		return dao.selectByEmpId(empId);
	}

}
