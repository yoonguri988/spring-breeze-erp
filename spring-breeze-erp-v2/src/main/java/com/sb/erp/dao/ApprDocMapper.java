package com.sb.erp.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.sb.erp.dto.ApprDocDto;
import com.sb.erp.dto.ApprDocInitResponseDto;
import com.sb.erp.dto.ApprFormDto;

@Mapper
public interface ApprDocMapper {
	public List<ApprFormDto> findForm(ApprDocDto dto);
	public ApprDocInitResponseDto initResponse(ApprDocDto dto);
	public ApprDocDto insertDoc(ApprDocDto dto);
	public ApprFormDto getForm(Map<String,Object> map);
}
