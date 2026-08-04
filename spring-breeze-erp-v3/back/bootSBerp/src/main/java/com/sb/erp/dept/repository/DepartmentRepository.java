package com.sb.erp.dept.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.dept.entity.Department;

// 언더스코어는 "강제 지정" 용도
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
	// 해당 회사가 가지고 있는 부서 개수 조회 
	// where com_id=? and is_deleted = false
	long countByCompany_IdAndDeletedFalse(Long comId);

	// 부서 전체 조회
	// CONNECT BY / 재귀 집계는 JPQL로 표현 불가 -> Native Query로 분리
	@EntityGraph(attributePaths = {"parent", "employee"})
	List<Department> findByCompany_IdAndDeletedFalseOrderByDepthAscSortOrderAsc(Long comId);
	
	// id 값을 통해 부서 하나 조회
	@EntityGraph(attributePaths = {"parent", "employee"})
	Optional<Department> findByDeptIdAndDeletedFalse(Long deptId);
	
	// 부서별 소속 사원 수 (하위부서 제외, 해당 부서 직속 인원만)
	// Department 엔티티엔 없는 값이라 [deptId, count] 쌍의 목록으로 별도 조회
	// -> Service에서 Map<Long, Long>으로 변환해서 화면에 부서별로 붙여서 사용
	@Query("select d.deptId, count(e) from Employee e join e.department d "
				+ "where d.company.id = :comId and d.deleted = false "
				+ "group by d.deptId")
	List<Object[]> countEmployeesGroupedByDept(@Param("comId") Long comId);
	
	// 부서별 소속 사원 수 (하위 부서까지 전부 포함한 재귀 합계)
	@Query(value = """
			WITH dept_closure AS (
			    SELECT CONNECT_BY_ROOT dept_id AS ancestor_dept_id, dept_id AS descendant_dept_id
			    FROM department
			    WHERE com_id = :comId AND is_deleted = 0
			    CONNECT BY PRIOR dept_id = parent_id AND is_deleted = 0
			),
			emp_count_per_dept AS (
			    SELECT dept_id, COUNT(*) AS cnt FROM employee GROUP BY dept_id
			)
			SELECT c.ancestor_dept_id AS deptId, SUM(NVL(ec.cnt, 0)) AS empCount
			FROM dept_closure c
			LEFT JOIN emp_count_per_dept ec ON ec.dept_id = c.descendant_dept_id
			GROUP BY c.ancestor_dept_id
			""", nativeQuery = true)
	List<Object[]> countEmployeesGroupedByDeptRecursive(@Param("comId") Long comId);
 
	
	// 부서 순서 정렬
	@Query("select coalesce(max(d.sortOrder), 0) from Department d "
			+ "where d.company.id = :comId and d.deleted = false "
			+ "and ((:parentId is null and d.parent is null) or d.parent.id = :parentId)")
	Integer findMaxSortOrder(@Param("comId") Long comId, @Param("parentId") Long parentId);

	// 부서 등록
	
	// 하위 부서 존재 확인
	//  where parent_id=? and is_deleted = false
	long countByParent_IdAndDeletedFalse(Long parentId);
	
	// 부서 삭제 (완전한 삭제)

	// 부서 수정
	
	// 하위 부서 조회
	@Query(value = """
			WITH childTree (dept_id) AS (
			    SELECT dept_id FROM department WHERE parent_id = :deptId AND is_deleted = 0
			    UNION ALL
			    SELECT d.dept_id FROM department d JOIN childTree c ON d.parent_id = c.dept_id
			    WHERE d.is_deleted = 0
			)
			SELECT dept_id FROM childTree
			""", nativeQuery = true)
	List<Long> selectAllChildIds(@Param("deptId") Long deptId);

	// 부서 통계 데이터 조회
	long countByCompany_IdAndDepthAndDeletedFalse(Long comId, Integer depth);
	long countByCompany_IdAndDepthInAndDeletedFalse(Long comId, List<Integer> depths);

	// 특정 부서 소속 재직원 수
	@Query("select count(e) from Employee e join e.department d "
			+ "where d.deptId = :deptId and d.deleted = false")
	long countByDept(@Param("deptId") Long deptId);
	
	// 부서 소프트 삭제
	@Modifying
	@Transactional
	@Query("update Department d set d.deptStatus = 'PENDING_DELETE' where d.deptId = :deptId")
	int requestSoftDelete(@Param("deptId") Long deptId);

	// 이관 이력 화면으이 원부서/대상부서 필터 - 부서상태 무관
	List<Department> findAllByCompany_IdOrderByDeptName(Long comId);
	
	// 부서 코드 중복 체크
	@Query("select d from Department d where d.company.id = :comId and d.deptCode = :deptCode")
	Optional<Department> selectDeptCode(@Param("comId") Long comId, @Param("deptCode") String deptCode);
}

//create - save: insert into department (컬럼,,,) values (?,,,)
//read   - findAll  : select * from department
//         findById : select * from department where id=?
//update - save : update department set 컬럼=?,,, where id=?
//delete - deleteById : delete department where id=?