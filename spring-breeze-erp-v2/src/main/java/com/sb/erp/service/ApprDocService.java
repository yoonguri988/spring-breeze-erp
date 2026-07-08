package com.sb.erp.service;

import java.util.List;
import java.util.Map;

import com.sb.erp.dto.ApprDocDto;
import com.sb.erp.dto.ApprDocInitResponseDto;
import com.sb.erp.dto.ApprFormDto;

public interface ApprDocService {
	public List<ApprFormDto> findForm(ApprDocDto dto);
	public ApprDocInitResponseDto initResponse(ApprDocDto dto);
	public ApprDocDto insertDoc(ApprDocDto dto);
	public ApprFormDto getForm(Map<String,Object> map);
}
