package com.sb.erp.dept.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sb.erp.dept.entity.DeptTransferLog;

@Repository
public interface DeptTransferLogRepository extends JpaRepository<DeptTransferLog, Long>{
	// 로그 삽입
	
	// 부서 이관 이력 조회
	@Query("""
			SELECT l
			FROM DeptTransferLog l
			WHERE l.company.id = :comId
			  AND (:originDeptId IS NULL OR l.originDept.deptId = :originDeptId)
			  AND (:targetDeptId IS NULL OR l.targetDept.deptId = :targetDeptId)
			  AND (:aiRecommended IS NULL OR :aiRecommended = '' OR l.aiRecommended = :aiRecommended)
			  AND (:dateFrom IS NULL OR l.createdAt >= :dateFrom)
			  AND (:dateTo IS NULL OR l.createdAt < :dateTo)
			ORDER BY l.createdAt DESC
			""")
		List<DeptTransferLog> searchTransferLogs(@Param("comId") Long comId,
		                                          @Param("originDeptId") Long originDeptId,
		                                          @Param("targetDeptId") Long targetDeptId,
		                                          @Param("aiRecommended") String aiRecommended,
		                                          @Param("dateFrom") LocalDateTime dateFrom,
		                                          @Param("dateTo") LocalDateTime dateTo,
		                                          Pageable pageable);
	
	// 부서 이관 전체 건수
	@Query("""
			SELECT COUNT(l)
			FROM DeptTransferLog l
			WHERE l.company.id = :comId
			  AND (:originDeptId IS NULL OR l.originDept.deptId = :originDeptId)
			  AND (:targetDeptId IS NULL OR l.targetDept.deptId = :targetDeptId)
			  AND (:aiRecommended IS NULL OR :aiRecommended = '' OR l.aiRecommended = :aiRecommended)
			  AND (:dateFrom IS NULL OR l.createdAt >= :dateFrom)
			  AND (:dateTo IS NULL OR l.createdAt < :dateTo)
			""")
		int listTotal(@Param("comId") Long comId,
		              @Param("originDeptId") Long originDeptId,
		              @Param("targetDeptId") Long targetDeptId,
		              @Param("aiRecommended") String aiRecommended,
		              @Param("dateFrom") LocalDateTime dateFrom,
		              @Param("dateTo") LocalDateTime dateTo);
}
