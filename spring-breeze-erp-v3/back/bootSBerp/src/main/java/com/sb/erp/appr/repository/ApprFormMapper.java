package com.sb.erp.appr.repository;


import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sb.erp.appr.dto.request.ApprFormSearchCondition;
import com.sb.erp.appr.dto.response.ApprFormResponse;

@Mapper
public interface ApprFormMapper {
	
	// 목록 검색 + 페이징 / 최신 버전만
	public List<ApprFormResponse> selectFormList(ApprFormSearchCondition condition);
	
	// 목록 검색 전체 개수 / 페이징
	public int listFormCnt(ApprFormSearchCondition condition);
	
	// 양식 코드 중복 확인 / 본인 제외
	public String findByCode(@Param("forCode") String forCode,
					  @Param("comId") long comId,
					  @Param("forId") Long forId);
}
