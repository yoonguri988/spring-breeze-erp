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
	
	// 작성하려는 사용자의 회사 양식
	@Override
	public List<ApprFormDto> findForm(ApprDocDto dto) {
		return dao.findForm(dto);
	}
	
	// 양식 값 가져오기
	@Override
	public ApprFormDto getForm(Map<String,Object> map) {
		return dao.getForm(map);
	}

	// 결재 양식 작성하려는 사용자의 인적사항
	@Override
	public ApprDocInitResponseDto initResponse(ApprDocDto dto) {
		return dao.initResponse(dto);
	}

	// 결재 문서 작성
	@Override
	public ApprDocDto insertDoc(ApprDocDto dto) {
		return dao.insertDoc(dto);
	}

	// 대시보드용 통계
	@Override
	public Map<String, Object> selectDocCnt(ApprDocDto dto) {
		return dao.selectDocCnt(dto);
	}

	// 내가 결재 했던 모든 문서
	@Override
	public List<Map<String, Object>> selectMyHistoryDocs(ApprDocDto dto) {
		return dao.selectMyHistoryDocs(dto);
	}

	// 내가 결재 해야할 모든 문서
	@Override
	public List<Map<String, Object>> selectMyTodoDocs(ApprDocDto dto) {
		return dao.selectMyTodoDocs(dto);
	}
	
}
