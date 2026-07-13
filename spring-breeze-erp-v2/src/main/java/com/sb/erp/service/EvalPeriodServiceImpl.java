package com.sb.erp.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.sb.erp.dao.EvalPeriodMapper;
import com.sb.erp.dto.EvalPeriodDto;
import com.sb.erp.dto.EvalPeriodSearchDto;
import com.sb.erp.util.SecurityUtil;

@Service
public class EvalPeriodServiceImpl implements EvalPeriodService {
	@Autowired EvalPeriodMapper dao;
	@Autowired @Lazy EvalReportBatchService evalReportBatchService;

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
		EvalPeriodDto period = selectByPeriodId(periodId); // 이미 comId 검증 포함
		if (period == null) {
			return -1;
		}

		// 현재 상태 확인
		if (!"READY".equals(period.getPeriodStatus())) {
			return -2;
		}

		// 상태 변경
		return dao.updateStatus(periodId, "OPEN", SecurityUtil.getCurrentComId());
	}

	@Override
	public int closePeriod(int periodId) {
		// 회차 소유 확인
		EvalPeriodDto period = selectByPeriodId(periodId);
		if (period == null) {
			return -1;
		}

		// 현재 상태 확인
		if (!"OPEN".equals(period.getPeriodStatus())) {
			return -2;
		}

		return dao.updateStatus(periodId, "CLOSED", SecurityUtil.getCurrentComId());
	}

	@Override
	@Transactional
	public int reportPeriod(int periodId) {
		// 회차 소유 확인
		EvalPeriodDto period = selectByPeriodId(periodId);
		if (period == null) {
			return -1;
		}

		// 상태 확인: CLOSED(첫 시도) 또는 REPORTING_FAILED(재시도)에서만 가능
		// - REPORTING 상태에서 또 부르는 건 방지 (이미 진행 중)
		// - REPORTED에서 다시 부르는 건 방지 (완료된 것)
		String status = period.getPeriodStatus();
		if (!"CLOSED".equals(status) && !"REPORTING_FAILED".equals(status)) {
			return -2;
		}

		int comId = SecurityUtil.getCurrentComId();

		// 상태를 즉시 REPORTING으로 전환 (이 트랜잭션이 커밋되면 확정)
		int result = dao.updateStatus(periodId, "REPORTING", comId);
		if (result != 1) {
			return result;
		}

		// ⭐ 배치는 트랜잭션 커밋 후 실행되어야 함
		// - 커밋 전에 배치가 시작되면: 롤백 시 상태 불일치 + 배치가 존재하지 않는 REPORTING 회차 처리
		// - afterCommit 훅으로 커밋 확정 후에만 배치 개시
		// - SecurityContext는 async 스레드에서 못 쓰니 comId를 파라미터로 캡처
		final int finalComId = comId;
		TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
			@Override
			public void afterCommit() {
				evalReportBatchService.runInBackground(periodId, finalComId);
			}
		});

		return 1;
	}

	// ─── 중복 확인 ────────────────────────────────────
	@Override
	public boolean isDuplicate(int evalYear, String evalTerm) {
		return dao.isDuplicate(evalYear, evalTerm, SecurityUtil.getCurrentComId());
	}

	// ─── 하위 데이터 카운트 ──────────────────────────────
	@Override
	public int countEvalsByPeriodId(int periodId) {
		return dao.countEvalsByPeriodId(periodId);
	}

	@Override
	public int countReportsByPeriodId(int periodId) {
		return dao.countReportsByPeriodId(periodId);
	}

}
