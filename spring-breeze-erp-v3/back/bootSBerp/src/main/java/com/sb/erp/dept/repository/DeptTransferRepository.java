package com.sb.erp.dept.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.dept.entity.Department;
import com.sb.erp.emp.entity.Employee;

public interface DeptTransferRepository extends JpaRepository<Department, Long> {

	// 해당 부서가 자신이 속한 회사의 부서가 맞는지 확인
	int countByDeptIdAndCompany_Id(Long deptId, Long comId);
	
	// 삭제 대기중인 부서 목록 조회
	Optional<Department> findByDeptIdAndDeptStatus(Long deptId, String deptStatus);
	
	// 이관 대상 사원 조회
	List<Employee> findByDepartment_DeptIdOrderByPosition_PosOrderAscEmpNameAsc(Long deptId);
	
	// 사원 기준 미처리 예약 확인
//	List<Reservation> findByEmployee_Department_DeptIdAndStatusOrderByStartDtAsc(Long deptId, String status);
	
	// 사원 기준 미완료 결재라인
//	List<ApprLine> findByEmployee_Department_DeptIdAndLinStatusInOrderByLinOrderAsc(Long deptId, List<String> statuses);
	
	// 사원이 기안한 진행중 결재문서
//	List<ApprDoc> findByEmployee_Department_DeptIdAndDocStatusOrderByCreatedAtAsc(Long deptId, String docStatus);
	
	// 사원이 기안한 진행중 결재문서 제목 요약 — AI 프롬프트 재료 겸 dept_transfer_log.handover_snapshot 원본
	@Query(value = """
			SELECT LISTAGG(doc_title, ' | ') WITHIN GROUP (ORDER BY doc_title)
			FROM appr_doc
			WHERE doc_status = 'ING'
			  AND emp_id IN (SELECT emp_id FROM employee WHERE dept_id = :deptId)
			""", nativeQuery = true)
	String findPendingApprDocTitles(@Param("deptId") Long deptId);
	
	// 필터링: (1) 동일 상위조직(형제 부서) OR (2) 해체 대상 부서의 상위 부서 자체
	@Query("""
			SELECT d
			FROM Department d
			WHERE d.company.id = :comId
			  AND d.deptStatus = 'ACTIVE'
			  AND d.deptId != :deptId
			  AND (
			       d.parent.deptId = (SELECT t.parent.deptId FROM Department t WHERE t.deptId = :deptId)
			    OR d.deptId = (SELECT t.parent.deptId FROM Department t WHERE t.deptId = :deptId)
			  )
			ORDER BY d.deptName
			""")
	List<Department> findCandidateDepartments(@Param("comId") Long comId, @Param("deptId") Long deptId);
	
	// 필터링: 필터링 실패 시 폴백용 전체 목록
	List<Department> findByCompany_IdAndDeptStatusAndDeptIdNotOrderByDeptNameAsc(Long comId, String deptStatus, Long deptId);
	
	// 이관 취소 업데이트
	@Modifying
	@Transactional
	@Query("UPDATE Department d SET d.deptStatus = 'ACTIVE' WHERE d.deptId = :deptId")
	int updateActiveById(@Param("deptId") Long deptId);
 
	// 부서 이관 확정 - 원부서 상태를 DELETED로 변경
	@Modifying
	@Transactional
	@Query("UPDATE Department d SET d.deptStatus = 'DELETED' WHERE d.deptId = :deptId")
	int markDeleted(@Param("deptId") Long deptId);
	
	// 부서 이관 진행 (사원 부서 업데이트)
	@Modifying
	@Transactional
	@Query(value = "UPDATE employee SET dept_id = :newDeptId WHERE emp_id = :empId", nativeQuery = true)
	int updateEmployeeDept(@Param("empId") Long empId, @Param("newDeptId") Long newDeptId);
	
	
	// 이관 대기(PENDING_DELETE) 부서 목록
	@Query("""
			SELECT d
			FROM Department d
			WHERE d.company.id = :comId
			  AND d.deptStatus = 'PENDING_DELETE'
			  AND (
			       :keyword IS NULL OR :keyword = ''
			       OR UPPER(d.deptName) LIKE UPPER(CONCAT('%', :keyword, '%'))
			       OR UPPER(d.deptCode) LIKE UPPER(CONCAT('%', :keyword, '%'))
			  )
			ORDER BY d.updatedAt DESC
			""")
	List<Department> findPendingTransferDepts(@Param("comId") Long comId, @Param("keyword") String keyword);
}
//create - save: insert into department (컬럼,,,) values (?,,,)
//read   - findAll  : select * from dept_transfer_log
//       findById : select * from dept_transfer_log where id=?
//update - save : update dept_transfer_log set 컬럼=?,,, where id=?
//delete - deleteById : delete dept_transfer_log where id=?