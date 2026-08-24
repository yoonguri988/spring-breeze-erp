package com.sb.erp.appr.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.appr.dto.request.ApprDocRequest;
import com.sb.erp.appr.dto.request.ApprDocSearchCondition;
import com.sb.erp.appr.dto.response.ApprDocInitResponse;
import com.sb.erp.appr.dto.response.ApprDocResponse;
import com.sb.erp.appr.dto.response.ApprDocSummaryResponse;
import com.sb.erp.appr.dto.response.ApprFormResponse;
import com.sb.erp.appr.dto.response.ApprLineResponse;
import com.sb.erp.appr.repository.ApprDocMapper;
import com.sb.erp.appr.repository.ApprLineMapper;
import com.sb.erp.dept.dto.response.DeptResponse;
import com.sb.erp.dept.service.DeptService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApprDocServiceImpl implements ApprDocService{

	private final ApprDocMapper dao;
	private final ApprLineMapper lineDao;
	private final DeptService deptService;
	private final ApprAutoDelegationTriggerService autoTrigger;
	
	// 작성하려는 사용자의 회사 양식
	@Override
	public List<ApprFormResponse> findForm(Long comId) {
		return dao.findForm(comId);
	}
	
	// 결재 양식 작성하려는 사용자의 인적사항
	@Override
	public ApprDocInitResponse initResponse(Long empId) {
		return dao.initResponse(empId);
	}

	
	// 결재선, 문서 insert
	@Override
	@Transactional
	public Long insertDocAndLine(ApprDocRequest req, Long empId, Long comId) {
		
		// 문서 데이터 등록
		dao.insertDoc(req, empId, comId);
		
		// 문서 id
		Long docId = dao.selectCurrentDocSeq();
		
		// 결재선 순차 등록
		List<Long> approverEmpIds = req.getApproverEmpIds();
		if (approverEmpIds != null && !approverEmpIds.isEmpty()) {
			for (int i = 0; i < approverEmpIds.size(); i++) {
				int linOrder = i + 1;
				String status = (linOrder == 1) ? "WAI" : "NOT";
				lineDao.insertLine(docId, approverEmpIds.get(i), linOrder, status);
			}
		}
		return docId;
	}

	// 대시보드용 통계
	@Override
	public Map<String, Object> selectDocCnt(Long empId) {
		return dao.selectDocCnt(empId);
	}

	// 내가 결재 했던 모든 문서
	@Override
	public List<ApprDocSummaryResponse> selectMyHistoryDocs(ApprDocSearchCondition condition) {
		return dao.selectMyHistoryDocs(condition);
	}

	// 내가 결재 해야할 모든 문서
	@Override
	public List<ApprDocSummaryResponse> selectMyTodoDocs(ApprDocSearchCondition condition) {
		return dao.selectMyTodoDocs(condition);
	}

	// 상세 페이지 docId로 데이터 가져오기
	@Override
	public ApprDocResponse selectDocDetail(Long docId) {
		ApprDocResponse detail = dao.selectDocDetail(docId);
		if (detail == null) {
			throw new IllegalArgumentException("존재하지 않는 문서입니다");
		}
		return detail;
	}

	// 기안자 상사들 목록 조회
	@Override
	public List<ApprLineResponse> approversByEmpId(Long empId) {
		return dao.approversByEmpId(empId);
	}

	// docId로 결재선 가져오기
	@Override
	public List<ApprLineResponse> selectLinesByDocId(Long docId) {
		return lineDao.selectLinesByDocId(docId);
	}

	// 결재 처리 로직 (승/반)
	@Override
	@Transactional
	public void processLine(Long docId, Long empId, String action) {
		
		// 낙관적 락 검증 리팩토링 이후 3차 진행때 추가
		
		// 결재선 상태 갱신
		int updated = lineDao.updateLineStatus(docId, empId, action);
		if (updated == 0) {
			throw new IllegalArgumentException("처리할 수 있는 결재선이 없습니다");
		}
		
		// 반려했을시 처리
		if ("REJ".equals(action)) {
			dao.updateDocStatus(docId, "REJ");
			return;
		}
		
		// 승인했을시 처리
		
		// 전체 결재선 라인
		List<ApprLineResponse> lines = lineDao.selectLinesByDocId(docId);
		
		// 현재 결재자 정보
		ApprLineResponse current = lines.stream()
				.filter(l -> l.getEmpId().equals(empId))
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("결재선 정보를 찾을 수 없습니다."));
		
		// 다음 결재자 정보
		ApprLineResponse next = lines.stream()
				.filter(l -> l.getLinOrder() == current.getLinOrder() + 1)
				.findFirst()
				.orElse(null);
		
		// 다음 순서 있는지 검증
		if (next != null) {
			// 있는경우
			lineDao.updateLineStatus(docId, next.getEmpId(), "WAI");
		}
		else {
			// 없는경우
			dao.updateDocStatus(docId, "APP");
			
			// 위임전결 자동발동 트리거
			ApprDocResponse doc = dao.selectDocDetail(docId);
			autoTrigger.tryTrigger(docId, doc.getForId(), doc.getForVersion(), doc.getEmpId(), doc.getDocContent());
		}
		
	}

	// 결재선 지정용 - 부서 내 직원 목록
	@Override
	public List<ApprLineResponse> selectDeptEmpsForLines(Long deptId, Long empId) {
		return dao.selectDeptEmpsForLines(deptId, empId);
	}

	// 결재선 지정 가능 인원수
	@Override
	public List<DeptResponse> cntApprovers(Long deptId, Long empId) {
		List<DeptResponse> chain = deptService.selectAncestorDepts(deptId);
		
		for (DeptResponse d : chain) {
			int cnt = dao.cntApprovers(d.getDeptId(), empId);
			d.setEmpCount(cnt);
		}
		return chain;
	}

	// 모든 문서 카운트
	@Override
	public int selectMyHistoryDocsCnt(ApprDocSearchCondition condition) {
		return dao.selectMyHistoryDocsCnt(condition);
	}

	// 본인차례 결재 문서 카운트
	@Override
	public int selectMyTodoDocsCnt(ApprDocSearchCondition condition) {
		return dao.selectMyTodoDocsCnt(condition);
	}
	
}
