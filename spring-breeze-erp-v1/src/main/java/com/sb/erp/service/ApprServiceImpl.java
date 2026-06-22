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
	@Autowired ApprMapper dao;
	
	@Override
	public String getCompanyName(int comId) {
		return dao.getCompanyName(comId);
	}
	
	@Override
	public List<CompanySearchDto> searchCompany(String keyword) {
		return dao.searchCompany(keyword);
	}

	@Override
	public int listFormCnt(ApprFormSearchDto dto) {
		return dao.listFormCnt(dto);
	}
	
	///////////////////////// 양식 관련 기능 //////////////////////////////////
	
	@Override
	public ApprFormDto selectFormAll(int forId) {
		return dao.selectFormAll(forId);
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
		
		return dao.insertForm(dto);
	}

	@Override
	public int updateForm(ApprFormDto dto) {
		
		// date 관련 호출됐을때 날짜 시간 처리
		LocalDateTime now = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		String setTime = now.format(formatter);
		
		dto.setForUpdated(setTime);
		
		return dao.updateForm(dto);
	}

	@Override
	public int deleteForm(int forId) {
		return dao.deleteForm(forId);
	}

	@Override
	public List<ApprFormDto> selectFormList(ApprFormSearchDto dto) {
		dto.setPstartno((dto.getPstartno()-1)*dto.getOnepagelist());
		return dao.selectFormList(dto);
	}

	@Override
	public String findByCode(ApprFormDto dto) {
		return mapper.findByCode(dto);
	}

	///////////////////////// 양식 관련 기능 //////////////////////////////////
	
}
