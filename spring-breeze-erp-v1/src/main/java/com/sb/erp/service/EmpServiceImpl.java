package com.sb.erp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sb.erp.dao.EmpMapper;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.EmpSearchDto;

@Service
public class EmpServiceImpl implements EmpService {

	@Autowired EmpMapper dao;
	
	@Override
	public List<EmpDto> selectAll() {
		return dao.selectAll();
	}

	@Override
	public EmpDto selectByEmpId(int empId) {
		return dao.selectByEmpId(empId);
	}

	@Override
	public List<EmpDto> search(EmpSearchDto dto) {
		return dao.search(dto);
	}

}
