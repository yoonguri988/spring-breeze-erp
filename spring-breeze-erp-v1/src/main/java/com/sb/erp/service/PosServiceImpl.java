package com.sb.erp.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sb.erp.dao.PosMapper;
import com.sb.erp.dto.PosDto;

@Service
public class PosServiceImpl implements PosService {

	@Autowired PosMapper dao;
	
	@Override
	public List<PosDto> selectAll() {
		return dao.selectAll();
	}

}
