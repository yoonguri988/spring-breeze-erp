package com.sb.erp.dao;

import org.apache.ibatis.annotations.Mapper;

import com.sb.erp.dto.ApprLineDto;

@Mapper
public interface ApprLineMapper {
	public int insertLine(ApprLineDto dto);
	public int updateLineStatus(ApprLineDto dto);
	public ApprLineDto selectLineByOrder(ApprLineDto dto);
}
