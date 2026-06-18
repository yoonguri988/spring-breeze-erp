package com.sb.erp.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
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
	public String getCompanyName(int comId) {
		return mapper.getCompanyName(comId);
	}
	
	@Override
	public List<CompanySearchDto> searchCompany(String keyword) {
		return mapper.searchCompany(keyword);
	}
	
	@Override
	public List<ApprFormDto> list10Form(int pstartno) {
		HashMap<String,Integer> map = new HashMap<>();
		map.put("start", (pstartno-1)*10);
		map.put("end", 10);
		return mapper.list10Form(map);
	}

	@Override
	public int listFormCnt() {
		return mapper.listFormCnt();
	}
	
	///////////////////////// 양식 관련 기능 //////////////////////////////////
	
	@Override
	public ApprFormDto selectFormAll(int forId) {
		return mapper.selectFormAll(forId);
	}

	@Override
	public int insertForm(ApprFormDto dto) {
		
		LocalDateTime now = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		String setTime = now.format(formatter);
		
		dto.setForCreated(setTime);
		dto.setForUpdated(setTime);
		
		if(dto.getForStatus() == null) {
			dto.setForStatus(false);
		}
		
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
	public int deleteForm(int forId) {
		return mapper.deleteForm(forId);
	}

	@Override
	public List<ApprFormDto> selectFormList(ApprFormSearchDto dto) {
		return mapper.selectFormList(dto);
	}

	///////////////////////// 양식 관련 기능 //////////////////////////////////
	
}
