package com.sb.erp.appr.repository;


import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.sb.erp.appr.dto.ApprFormDto;
import com.sb.erp.appr.dto.ApprFormSearchDto;

@Mapper
public interface ApprFormMapper {
	
	// 목록 검색 + 페이징 / 최신 버전만
	List<ApprFormDto> selectFormList(ApprFormSearchDto dto);
	
	// 목록 검색 전체 개수 / 페이징
	int listFormCnt(ApprFormSearchDto dto);
	
	// 양식 코드 중복 확인 / 본인 제외
	String findByCode(ApprFormDto dto);
}
