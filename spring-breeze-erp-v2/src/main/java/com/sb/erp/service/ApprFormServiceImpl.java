package com.sb.erp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.ApprFormMapper;
import com.sb.erp.dto.ApprFormDto;
import com.sb.erp.dto.ApprFormSearchDto;
import com.sb.erp.dto.CompanySearchDto;

@Service
public class ApprFormServiceImpl implements ApprFormService {
	@Autowired ApprFormMapper dao;  
	
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
	public ApprFormDto selectFormAll(ApprFormDto dto) {
		return dao.selectFormAll(dto);
	}

	@Override
	public int insertForm(ApprFormDto dto) {
		
		// forStatus null로 들어왔을때 오류 방지
		if(dto.getForStatus() == null) {
			dto.setForStatus(false);
		}
		
		return dao.insertForm(dto);
	}

	@Override
	public int updateForm(ApprFormDto dto) {
		
		return dao.updateForm(dto);
	}

	@Override
	public int deleteForm(ApprFormDto dto) {
		return dao.deleteForm(dto);
	}

	@Override
	public List<ApprFormDto> selectFormList(ApprFormSearchDto dto) {
		dto.setPstartno((dto.getPstartno()-1)*dto.getOnepagelist());
		return dao.selectFormList(dto);
	}

	@Override
	public String findByCode(ApprFormDto dto) {
		return dao.findByCode(dto);
	}

	///////////////////////// 양식 관련 기능 //////////////////////////////////
	
}
