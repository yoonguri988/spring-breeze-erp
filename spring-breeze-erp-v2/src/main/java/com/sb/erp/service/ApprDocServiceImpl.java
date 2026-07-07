package com.sb.erp.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.ApprDocMapper;
import com.sb.erp.dto.ApprDocDto;
import com.sb.erp.dto.ApprDocInitResponseDto;
import com.sb.erp.dto.ApprFormDto;

@Service
public class ApprDocServiceImpl implements ApprDocService{

	@Autowired ApprDocMapper dao;
	
	@Override
	public List<ApprFormDto> findForm(ApprDocDto dto) {
		return dao.findForm(dto);
	}

	@Override
	public ApprDocInitResponseDto initResponse(ApprDocDto dto) {
		return dao.initResponse(dto);
	}

	@Override
	public ApprDocDto insertDoc(ApprDocDto dto) {
		return dao.insertDoc(dto);
	}

	@Override
	public ApprFormDto getForm(Map<String,Object> map) {
		return dao.getForm(map);
	}
	
}
