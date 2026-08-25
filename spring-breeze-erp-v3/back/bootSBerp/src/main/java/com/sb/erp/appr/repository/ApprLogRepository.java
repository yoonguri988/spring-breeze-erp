package com.sb.erp.appr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sb.erp.appr.entity.ApprLog;

@Repository
public interface ApprLogRepository  extends JpaRepository<ApprLog, Long>{
	
	public List<ApprLog> findByApprDoc_DocIdOrderByCreatedAtDesc(Long docId);
	
	// 취소 승인시 해당 위임전결이 건드릴 로그만 조회
	public List<ApprLog> findByAutoDeleg_AutoDelegId(Long autoDelegId);
}
