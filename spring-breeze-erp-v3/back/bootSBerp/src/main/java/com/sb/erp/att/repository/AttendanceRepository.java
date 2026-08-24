package com.sb.erp.att.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sb.erp.att.entity.Attendance;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
	
	
	// 사원 근태 목록 (날짜범위 + 부서 필터 + 페이징)
	@Query(value = 
			"SELECT * FROM ( " +
				"SELECT sub.*, ROWNUM AS rNUM " +
				"FROM ( " +
					"SELECT a.*, e.EMP_NAME, e.EMP_NO, d.DEPT_NAME " +
					"FROM attendance a " +
					"JOIN employee e ON a.EMP_ID = e.EMP_ID " +
					"JOIN department d ON e.DEPT_ID = d.DEPT_ID " +
					"WHERE a.ATT_DATE BETWEEN :startDate AND :endDate " +
					"ORDER BY a.ATT_DATE DESC) sub ) " +
				"WHERE rnum BETWEEN :start AND :end",
			nativeQuery = true)
	List<Attendance> findAttendanceWithPaging(
			@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate,
			@Param("start") int start, 
			@Param("end") int end);
	
	// 사원 근태 상세 조회
	List<Attendance> findByEmployee_EmpId(Long empId);
	
	// 출근 중복 체크
	long countByEmployee_EmpIdAndAttDate(Long empId, LocalDate attDate);
	
	// 출근 기록
	Optional<Attendance> findByEmployee_EmpIdAndAttDate(Long empId, LocalDate attDate);

	// 급여 산정(고정연장수당, sal 모듈 OvertimeAllowanceCalculator)용 - 기간 내 연장근로시간(분) 합계.
	// 해당 기간에 근태 기록이 아예 없으면 SUM은 NULL이 되므로 COALESCE로 0을 반환한다.
	@Query("SELECT COALESCE(SUM(a.overtimeMinutes), 0) FROM Attendance a " +
			"WHERE a.employee.empId = :empId AND a.attDate BETWEEN :start AND :end")
	Integer sumOvertimeMinutesByEmpIdAndDateRange(@Param("empId") Long empId,
			@Param("start") LocalDate start,
			@Param("end") LocalDate end);

}
