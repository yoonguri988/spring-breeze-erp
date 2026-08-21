package com.sb.erp.appr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sb.erp.appr.entity.ApprLineRequest;

@Repository
public interface ApprLineRequestRepository extends JpaRepository<ApprLineRequest, Long>{
	
	// 관리자용 - 승인 대기중인 요청
	public List<ApprLineRequest> findByReqStatusOrderByCreatedAtDesc(String reqStatus);
	
	// 사용자용 - 본인이 신청한 요청 목록
	public List<ApprLineRequest> findByReqEmp_EmpIdOrderByCreatedAtDesc(Long empId);
}
