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
	public String getCompanyName(int comId) {
		return mapper.getCompanyName(comId);
	}
	
	@Override
	public List<CompanySearchDto> searchCompany(String keyword) {
		return mapper.searchCompany(keyword);
	}

	@Override
	public int listFormCnt(ApprFormSearchDto dto) {
		return mapper.listFormCnt(dto);
	}
	
	///////////////////////// 양식 관련 기능 //////////////////////////////////
	
	@Override
	public ApprFormDto selectFormAll(int forId) {
		return mapper.selectFormAll(forId);
	}

	@Override
	public int insertForm(ApprFormDto dto) {
		
		// date 관련 호출됐을때 날짜 시간 처리
		LocalDateTime now = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		String setTime = now.format(formatter);
		
		// dto에 시간 set
		dto.setForCreated(setTime);
		dto.setForUpdated(setTime);
		
		// forStatus null로 들어왔을때 오류 방지
		if(dto.getForStatus() == null) {
			dto.setForStatus(false);
		}
		
		return mapper.insertForm(dto);
	}

	@Override
	public int updateForm(ApprFormDto dto) {
		
		// date 관련 호출됐을때 날짜 시간 처리
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

	@Override
	public String findByCode(ApprFormDto dto) {
		return mapper.findByCode(dto);
	}

	///////////////////////// 양식 관련 기능 //////////////////////////////////
	
}
