package com.sb.erp.appr.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sb.erp.appr.dto.response.ApprLineResponse;

@Mapper
public interface ApprLineMapper {
	
	public List<ApprLineResponse> selectLinesByDocId(@Param("docId") long docId);
}
