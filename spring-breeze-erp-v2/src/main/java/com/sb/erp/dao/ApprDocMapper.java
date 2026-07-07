package com.sb.erp.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.sb.erp.dto.ApprDocDto;
import com.sb.erp.dto.ApprDocInitResponseDto;
import com.sb.erp.dto.ApprFormDto;

@Mapper
public interface ApprDocMapper {
	
	// 문서 작성 파트
	public List<ApprFormDto> findForm(ApprDocDto dto);
	public ApprDocInitResponseDto initResponse(ApprDocDto dto);
	public ApprDocDto insertDoc(ApprDocDto dto);
	public ApprFormDto getForm(Map<String,Object> map);
	
	// 문서 조회 파트
	public Map<String, Object> selectDocCnt(ApprDocDto dto);
	public List<Map<String, Object>> selectMyHistoryDocs(ApprDocDto dto);
	public List<Map<String, Object>> selectMyTodoDocs(ApprDocDto dto);
	
}
