package com.sb.erp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sb.erp.dao.DeptMapper;
import com.sb.erp.dto.DeptDto;

@Service
public class DeptServiceImpl implements DeptService {

	@Autowired DeptMapper dao;
	@Override
	public List<DeptDto> selectAll() {
		return dao.selectAll();
	}

}
