package com.sb.erp.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.ApprMapper;
import com.sb.erp.dto.ApprFormDto;
import com.sb.erp.dto.ApprFormSearchDto;
import com.sb.erp.dto.CompanySearchDto;

@Service
public class ApprServiceImpl implements ApprService {
	
	@Autowired ApprMapper mapper;

	
	
	@Override
	public int getCompanyIdByName(String name) {
		return mapper.getCompanyIdByName(name);
	}
	
	@Override
	public List<CompanySearchDto> searchCompany(String keyword) {
		return mapper.searchCompany(keyword);
	}
	
	/////////////////////// 결재 양식 파트 //////////////////////////////////
	
	@Override
	public ApprFormDto selectFormAll() {
		return mapper.selectFormAll();
	}

	@Override
	public int insertForm(ApprFormDto dto) {
		
		LocalDateTime now = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		String setTime = now.format(formatter);
		
		dto.setForCreated(setTime);
		dto.setForUpdated(setTime);
		
		return mapper.insertForm(dto);
	}

	@Override
	public int updateForm(ApprFormDto dto) {
		LocalDateTime now = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		String setTime = now.format(formatter);
		
		dto.setForUpdated(setTime);
		
		return mapper.updateForm(dto);
	}

	@Override
	public int deleteFrom(ApprFormDto dto) {
		return mapper.deleteFrom(dto);
	}

	@Override
	public ApprFormDto selectFromList(ApprFormSearchDto dto) {
		return mapper.selectFromList(dto);
	}

	/////////////////////// 결재 양식 파트 //////////////////////////////////
	
}
