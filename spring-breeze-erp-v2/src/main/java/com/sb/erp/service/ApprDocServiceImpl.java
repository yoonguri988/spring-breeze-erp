package com.sb.erp.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.dao.ApprDocMapper;
import com.sb.erp.dao.ApprLineMapper;
import com.sb.erp.dto.ApprDocDto;
import com.sb.erp.dto.ApprDocInitResponseDto;
import com.sb.erp.dto.ApprFormDto;
import com.sb.erp.dto.ApprLineDto;

@Service
public class ApprDocServiceImpl implements ApprDocService{

	@Autowired ApprDocMapper dao;
	@Autowired ApprLineMapper lineDao;
	
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
	public int insertDoc(ApprDocDto dto) {
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

	// 상사들 다 가져오기
	@Override
	public List<ApprLineDto> approversByEmpId(ApprDocDto dto) {
		return dao.approversByEmpId(dto);
	}

	// 결재 문서 상태 수정
	@Override
	public int updateDocStatus(ApprDocDto dto) {
		return dao.updateDocStatus(dto);
	}

	// 결재선 insert
	@Override
	@Transactional
	public boolean insertLines(ApprDocDto dto) {
		
		// 문서 데이터 넣기
		dao.insertDoc(dto);
		
		// 새로 채번된 문서 id 막기
		int docId = dto.getDocId();
		
		// 폼에서 넘어온 결재선 데이터 추출
		List<ApprLineDto> lineList = dto.getApprLines();
		
		// 결재선 순차 적재
		if(lineList != null && !lineList.isEmpty()) {
			for(ApprLineDto line : lineList) {
				line.setDocId(docId);
				lineDao.insertLine(line);
			}
		}
		return true;
	}

	// 모든 문서 카운트
	@Override
	public int selectMyHistoryDocsCnt(ApprDocDto dto) {
		return dao.selectMyHistoryDocsCnt(dto);
	}

	// 본인차례 결재 문서 카운트
	@Override
	public int selectMyTodoDocsCnt(ApprDocDto dto) {
		return dao.selectMyTodoDocsCnt(dto);
	}

	// 상세 페이지 docId 로 데이터 가져오기 
	@Override
	public ApprDocDto selectDocDetail(int docId) {
		return dao.selectDocDetail(docId);
	}

	// docId로 결재선 가져오기
	@Override
	public List<ApprLineDto> selectLinesByDocId(int docId) {
		return lineDao.selectLinesByDocId(docId);
	}
	
	
	
}
