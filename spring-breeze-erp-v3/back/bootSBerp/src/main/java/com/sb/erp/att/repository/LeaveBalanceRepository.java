package com.sb.erp.att.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sb.erp.att.entity.LeaveBalance;

/**
 * leave_balance 조회 리포지토리 (신규).
 *
 * attendance_leave_ddl_v2.sql / LeaveBalance 엔티티에 대응하는 리포지토리가 아직 없어서 신규로 추가했다.
 * sal 모듈의 AnnualLeaveAllowanceCalculator가 연도별 미사용 연차일수(totalDays - usedDays)를 조회할 때 사용한다.
 */
@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {

    Optional<LeaveBalance> findByEmployee_EmpIdAndYear(Long empId, Integer year);
}
