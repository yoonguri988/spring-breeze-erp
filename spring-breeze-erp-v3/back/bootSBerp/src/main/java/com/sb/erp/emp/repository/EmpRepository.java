package com.sb.erp.emp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sb.erp.emp.entity.Employee;

@Repository
public interface EmpRepository extends JpaRepository<Employee, Long> {
	
	Optional<Employee> findByEmpNo(String empNo);
	
	// ── 관리자 대시보드용: 회사별 재직 사원 ID 목록 ──
	@Query("SELECT e.empId FROM Employee e " +
		   "WHERE e.company.comId = :comId AND e.empStatus = 'Y'")
		List<Long> findActiveEmpIdsByComId(@Param("comId") Long comId);
	
}