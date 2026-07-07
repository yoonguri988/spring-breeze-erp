package com.sb.erp.dao;

import org.apache.ibatis.annotations.Mapper;

import com.sb.erp.dto.DeptTransferLogDto;

@Mapper
public interface DeptTransferLogMapper {

	// 로그 삽입
	int insertTransferLog(DeptTransferLogDto logDto);
}
