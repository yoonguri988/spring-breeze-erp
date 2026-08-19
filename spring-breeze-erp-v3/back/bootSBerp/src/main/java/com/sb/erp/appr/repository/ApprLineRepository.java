package com.sb.erp.appr.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sb.erp.appr.entity.ApprLine;

@Repository
public interface ApprLineRepository extends JpaRepository<ApprLine, Long>{
	
	// 다음 결재 순서가 있는지 조회 / doc_id + lin_order
	//Optional<ApprLine> findByApprDoc_DocIdAndLinOrder(Long docId, Integer linOrder);
	
	// 특정 문서에서 특정 결재자의 라인 찾기 (상태 변경)
	//Optional<ApprLine> findByApprDoc_DocIdAndEmployee_EmpId(Long docId, Long empId);
}
