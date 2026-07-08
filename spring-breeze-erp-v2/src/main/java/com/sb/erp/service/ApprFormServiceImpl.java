package com.sb.erp.service;

import java.util.ConcurrentModificationException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
	@Transactional
	public int updateForm(ApprFormDto dto) {
		
		// 원본 데이터 넣기
		ApprFormDto original = dao.selectFormAll(dto);
		
		// 삭제 혹은 수정으로 인한 데이터 변조시 방어
		if(original == null) {
			throw new ConcurrentModificationException("이미 다른 사용자에 의해 수정,삭제된 양식입니다");
		}
		
		// insert, update 분기점 확인 / 데이터가 바뀌었는지 원본과 대조
		boolean test = !original.getForTitle().equals(dto.getForTitle())
					|| !original.getForContent().equals(dto.getForContent());
		
		// 확인후 처리
		if(test) { // 중요 데이터가 바뀌었을경우 version +1 처리
			dto.setCreatedAt(original.getCreatedAt());
			return dao.updateFormNewVersion(dto);
		}
		else { // 중요 데이터가 바뀌지 않았을경우 일반 update 처리
			return dao.updateForm(dto);
		}
	}
	
	
	@Override
	public int deleteForm(ApprFormDto dto) {
		return dao.deleteForm(dto);
	}

	@Override
	public List<ApprFormDto> selectFormList(ApprFormSearchDto dto) {
		return dao.selectFormList(dto);
	}

	@Override
	public String findByCode(ApprFormDto dto) {
		return dao.findByCode(dto);
	}

	///////////////////////// 양식 관련 기능 //////////////////////////////////
	
}
