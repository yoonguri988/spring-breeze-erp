package com.sb.erp.appr.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.sb.erp.appr.dto.ApprLineDto;

@Mapper
public interface ApprLineMapper {
	public int insertLine(ApprLineDto dto);
	public int updateLineStatus(ApprLineDto dto);
	public ApprLineDto selectLineByOrder(ApprLineDto dto);
	public List<ApprLineDto> selectLinesByDocId(int docId);
}
