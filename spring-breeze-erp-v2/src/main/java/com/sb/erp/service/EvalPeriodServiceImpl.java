package com.sb.erp.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.EvalPeriodMapper;
import com.sb.erp.dto.EvalPeriodDto;
import com.sb.erp.dto.EvalPeriodSearchDto;
import com.sb.erp.util.SecurityUtil;

@Service
public class EvalPeriodServiceImpl implements EvalPeriodService  {
	@Autowired EvalPeriodMapper dao;

	// ─── 회차 조회 ────────────────────────────────────
	@Override
	public List<EvalPeriodDto> search(EvalPeriodSearchDto search) {
		search.setComId(SecurityUtil.getCurrentComId());
		return dao.search(search);
	}

	@Override
	public EvalPeriodDto selectByPeriodId(int periodId) {
		return dao.selectByPeriodId(periodId, SecurityUtil.getCurrentComId());
	}

	@Override
	public Map<String, Integer> countByStatusAll() {
		return dao.countByStatusAll(SecurityUtil.getCurrentComId());
	}
	
	
	// ─── 회차 등록/수정 ────────────────────────────────
	@Override
	public int insert(EvalPeriodDto dto) {
		dto.setComId(SecurityUtil.getCurrentComId());
		return dao.insert(dto);
	}

	@Override
	public int update(EvalPeriodDto dto) {
		dto.setComId(SecurityUtil.getCurrentComId());
		return dao.update(dto);
	}

	// 이하 회차 상태 업데이트
	@Override
	public int openPeriod(int periodId) {
		// 회차 소유 확인
	    EvalPeriodDto period = selectByPeriodId(periodId);  // 이미 comId 검증 포함
	    if (period == null) { return -1; }
	    
	    // 현재 상태 확인
	    if (!"READY".equals(period.getPeriodStatus())) { return -2; }
	    
	    // 상태 변경
	    return dao.updateStatus(periodId, "OPEN", SecurityUtil.getCurrentComId());
	}

	@Override
	public int closePeriod(int periodId) {
		// 회차 소유 확인
		EvalPeriodDto period = selectByPeriodId(periodId);
		if (period == null) { return -1; }
		
		// 현재 상태 확인
		if (!"OPEN".equals(period.getPeriodStatus())) { return -2; }
		
		return dao.updateStatus(periodId, "CLOSED", SecurityUtil.getCurrentComId());
	}

	@Override
	public int reportPeriod(int periodId) {
		// 회차 소유 확인
		EvalPeriodDto period = selectByPeriodId(periodId);
		if(period == null) { return -1; }
		
		// 현재 상태 확인
		if (!"CLOSED".equals(period.getPeriodStatus())) { return -2; }
		
		return dao.updateStatus(periodId, "REPORTED", SecurityUtil.getCurrentComId());
	}
	
	
	// ─── 중복 확인 ────────────────────────────────────
	@Override
	public boolean isDuplicate(int evalYear, String evalTerm) {
		return dao.isDuplicate(evalYear, evalTerm, SecurityUtil.getCurrentComId());
	}
	
	
	// ─── 하위 데이터 카운트 ──────────────────────────────
	@Override
	public int countEvalsByPeriodId(int periodId) { return dao.countEvalsByPeriodId(periodId); }

	@Override
	public int countReportsByPeriodId(int periodId) { return dao.countReportsByPeriodId(periodId); }
	
	

}
