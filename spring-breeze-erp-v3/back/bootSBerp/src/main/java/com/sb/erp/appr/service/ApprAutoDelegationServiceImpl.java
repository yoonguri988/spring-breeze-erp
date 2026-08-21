package com.sb.erp.appr.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.appr.dto.request.ApprAutoDelegationCancelRequest;
import com.sb.erp.appr.dto.response.ApprAutoDelegationResponse;
import com.sb.erp.appr.entity.ApprAutoDelegation;
import com.sb.erp.appr.repository.ApprAutoDelegationRepository;
import com.sb.erp.emp.entity.Employee;
import com.sb.erp.global.exception.ResourceNotFoundException;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApprAutoDelegationServiceImpl implements ApprAutoDelegationService {
	
	private final ApprAutoDelegationRepository autoDao;
	private final EntityManager em;
	
	@Override
	public List<ApprAutoDelegationResponse> myDelegation(Long empId) {
		return autoDao.findByDelEmp_EmpIdOrderByCreatedAtDesc(empId).stream()
				.map(ApprAutoDelegationResponse::new)
				.collect(Collectors.toList());
	}

	@Override
	public List<ApprAutoDelegationResponse> listByStatus(String delegStatus) {
		return autoDao.findByDelegStatusOrderByCreatedAtDesc(delegStatus).stream()
				.map(ApprAutoDelegationResponse::new)
				.collect(Collectors.toList());
	}

	@Override
	@Transactional
	public void reqeustCancel(Long autoDelegId, Long empId, ApprAutoDelegationCancelRequest req) {
		
		ApprAutoDelegation deleg = autoDao.findById(autoDelegId)
				.orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 위임전결입니다."));
		
		if (!deleg.getDelEmp().getEmpId().equals(empId)) {
			throw new IllegalArgumentException("본인의 위임전결만 취소 요청할 수 있습니다.");
		}
		
		if (!"ACT".equals(deleg.getDelegStatus())) {
			throw new IllegalArgumentException("활성 상태의 위임전결만 취소 요청할 수 있습니다.");
		}
		
		deleg.setDelegStatus("CANC_REQ");
		deleg.setCancReason(req.getCancReason());
	}

	@Override
	@Transactional
	public void approveCancel(Long autoDelegId, Long adminEmpId) {
		
		ApprAutoDelegation deleg = autoDao.findById(autoDelegId)
				.orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 위임전결입니다."));
		
		if (!"CANC_REQ".equals(deleg.getDelegStatus())) {		
			throw new IllegalStateException("취소 요청 상태가 아닙니다.");
		}
		
		Employee admin = em.getReference(Employee.class, adminEmpId);
		deleg.setDelegStatus("CANC");
		deleg.setProcEmp(admin);
		deleg.setProcessedAt(LocalDateTime.now());
	}

	@Override
	@Transactional
	public void rejectCancel(Long autoDelegId, Long adminEmpId) {
		
		ApprAutoDelegation deleg = autoDao.findById(autoDelegId)
				.orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 위임전결입니다."));
		
		if (!"CANC_REQ".equals(deleg.getDelegStatus())) {
			throw new IllegalStateException("취소 요청 상태가 아닙니다.");
		}
		
		deleg.setDelegStatus("ACT");
		deleg.setCancReason(null);
	}

}
