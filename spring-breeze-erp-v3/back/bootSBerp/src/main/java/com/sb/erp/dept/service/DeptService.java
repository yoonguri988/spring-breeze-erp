package com.sb.erp.dept.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.com.entity.Company;
import com.sb.erp.com.repository.CompanyRepository;
import com.sb.erp.dept.dto.DeptDto.DeptResponseDto;
import com.sb.erp.dept.entity.Department;
import com.sb.erp.dept.repository.DepartmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)	
public class DeptService {
	private final DepartmentRepository repo;
	private final CompanyRepository comRepo;  
	
	// 부서 전체 조회 (평탄 목록, depth/sortOrder 순)
	public List<Department> getAllDepts(Long comId) {
		return repo.findByCompany_IdAndDeletedFalseOrderByDepthAscSortOrderAsc(comId);
	}
	
	// 조직도 트리 조회 (부모-자식 구조로 재구성)
	public List<Department> getOrgTree(Long comId) {
		List<Department> flatList = getAllDepts(comId);
		return buildTree(flatList);
	}
	
	// flatList(부모/자식 정보 포함)를 이용해 루트 목록 + children 구성
	private List<Department> buildTree(List<Department> flatList) {
		Map<Long, Department> map = new LinkedHashMap<>();
		List<Department> roots = new ArrayList<>();
 
		for (Department d : flatList) {
			d.setChildren(new ArrayList<>()); // 화면 구성용 children 초기화 (DB 반영 X)
			map.put(d.getDeptId(), d);
		}
		for (Department d : flatList) {
			if (d.getParent() != null && map.containsKey(d.getParent().getDeptId())) {
				map.get(d.getParent().getDeptId()).getChildren().add(d);
			} else {
				roots.add(d); // 최상위 부서
			}
		}
		return roots;
	}
	
	// 조직도 트리를 DFS로 평탄화 (테이블 형태로 들여쓰기 출력할 때 사용)
	public List<Department> flattenOrgTree(Long comId) {
		List<Department> rootList = getOrgTree(comId);
		List<Department> flatList = new ArrayList<>();
		for (Department root : rootList) {
			flattenDFS(root, 0, flatList);
		}
		return flatList;
	}
	
	//
	private void flattenDFS(Department dept, int depth, List<Department> result) {
		dept.setDepth(depth); // 화면 표시용 depth 재설정
		result.add(dept);
		for (Department child : dept.getChildren()) {
			flattenDFS(child, depth + 1, result);
		}
	}
	
	// 부서 등록
	@Transactional
	public Department createDept(Department dept, Long comId, Long parentId) {
		Company company = comRepo.findById(comId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회사입니다. ID: " + comId));
		dept.setCompany(company);
 
		if (parentId != null) {
			Department parent = repo.findByDeptIdAndDeletedFalse(parentId)
					.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상위 부서입니다. ID: " + parentId));
			dept.setParent(parent);
			dept.setDepth(parent.getDepth() + 1);
		} else {
			dept.setParent(null);
			dept.setDepth(0);
		}
 
		// 동일 부모 하위에서 sortOrder는 현재 최대값 + 1 로 배정
		Integer maxOrder = repo.findMaxSortOrder(comId, parentId);
		dept.setSortOrder(maxOrder + 1);
 
		return repo.save(dept);
	}
	
	//  부서 수정 (이름/코드 수정 + 상위 부서 이동)
	@Transactional
	public Department updateDept(Long deptId, Department updateInfo, Long newParentId) {
		Department dept = repo.findByDeptIdAndDeletedFalse(deptId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 부서입니다. ID: " + deptId));
 
		// 단순 필드 수정 (더티체킹으로 반영)
		dept.setDeptName(updateInfo.getDeptName());
		dept.setDeptCode(updateInfo.getDeptCode());
		if (updateInfo.getEmployee() != null) {
			dept.setEmployee(updateInfo.getEmployee());
		}
 
		Long curParentId = dept.getParent() != null ? dept.getParent().getDeptId() : null;
 
		// 상위 부서가 변경된 경우 (부서 이동)
		if (!Objects.equals(curParentId, newParentId)) {
			if (newParentId != null) {
				if (newParentId.equals(deptId)) {
					throw new IllegalArgumentException("자기 자신을 상위 부서로 지정할 수 없습니다.");
				}
				// 순환참조 방지: 이동 대상이 자신의 하위 부서인지 확인
				List<Long> childIds = repo.selectAllChildIds(deptId);
				if (childIds.contains(newParentId)) {
					throw new IllegalArgumentException("하위 부서로 이동할 수 없습니다.");
				}
				Department newParent = repo.findByDeptIdAndDeletedFalse(newParentId)
						.orElseThrow(() -> new IllegalArgumentException("이동할 상위 부서가 존재하지 않습니다. ID: " + newParentId));
				dept.setParent(newParent);
				dept.setDepth(newParent.getDepth() + 1);
			} else {
				dept.setParent(null);
				dept.setDepth(0);
			}
		}
 
		return dept; // 더티체킹(Dirty Checking)으로 update 쿼리 반영
	}
	
	// 부서 완전 삭제 (하위 부서 존재 시 삭제 불가)
	@Transactional
	public void deleteDept(Long deptId) {
		Department dept = repo.findByDeptIdAndDeletedFalse(deptId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 부서입니다. ID: " + deptId));
 
		if (repo.countByParent_IdAndDeletedFalse(deptId) > 0) {
			throw new IllegalStateException("하위 부서가 존재하여 삭제할 수 없습니다.");
		}
		repo.delete(dept);
	}
	
	// 부서 소프트 삭제 (삭제 요청 상태로 변경)
	@Transactional
	public void requestSoftDelete(Long deptId) {
		Department dept = repo.findByDeptIdAndDeletedFalse(deptId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 부서입니다. ID: " + deptId));
 
		if (repo.countByParent_IdAndDeletedFalse(deptId) > 0) {
			throw new IllegalStateException("하위 부서가 존재하여 삭제 요청할 수 없습니다.");
		}
		dept.setDeptStatus("PENDING_DELETE"); // 더티체킹으로 update 쿼리 반영
	}
	
	// 단건 조회
	public Department getDeptById(Long deptId) {
		return repo.findByDeptIdAndDeletedFalse(deptId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 부서입니다. ID: " + deptId));
	}
	
	// 부서 통계 데이터 조회 (deptTotal / dept0~2Total / empTotal)
	public DeptResponseDto getDeptStats(Long comId) {
		long deptTotal = repo.countByCompany_IdAndDeletedFalse(comId);
		long dept0Total = repo.countByCompany_IdAndDepthAndDeletedFalse(comId, 0);
		long dept1Total = repo.countByCompany_IdAndDepthAndDeletedFalse(comId, 1);
		long dept2Total = repo.countByCompany_IdAndDepthAndDeletedFalse(comId, 2);
 
		// 사원 총원 = 부서별 직속 인원수 합계
		// TODO: EmployeeRepository에 countByCompany_Id 같은 직접 카운트 메서드가 있다면
		//       그걸 사용하는 것이 더 정확함 (부서 미배정 사원 누락 방지)
		long empTotal = 0;
		for (Object[] row : repo.countEmployeesGroupedByDept(comId)) {
			empTotal += (Long) row[1];
		}
 
		DeptResponseDto dto = new DeptResponseDto(deptTotal, dept0Total, dept1Total, dept2Total, empTotal);
		return dto;
	}
	
	// 부서별 소속 사원 수 (직속 인원만) -> Map<deptId, count>
	public Map<Long, Long> getEmployeeCountByDept(Long comId) {
		List<Object[]> rows = repo.countEmployeesGroupedByDept(comId);
		Map<Long, Long> result = new LinkedHashMap<>();
		for (Object[] row : rows) {
			result.put((Long) row[0], (Long) row[1]);
		}
		return result;
	}
	
	//  부서별 소속 사원 수 (하위 부서 포함 재귀 합계) -> Map<deptId, count>
	public Map<Long, Long> getEmployeeCountByDeptRecursive(Long comId) {
		List<Object[]> rows = repo.countEmployeesGroupedByDeptRecursive(comId);
		Map<Long, Long> result = new LinkedHashMap<>();
		for (Object[] row : rows) {
			result.put(((Number) row[0]).longValue(), ((Number) row[1]).longValue());
		}
		return result;
	}
	
	// 특정 부서 소속 재직원 수
	public long countEmployees(Long deptId) {
		return repo.countByDept(deptId);
	}
	
	// 상위 부서 체인 조회 (부서명 목록, 맨 앞에 회사명 포함)
	public List<String> getAncestorChain(Long deptId) {
		List<String> chain = new ArrayList<>();
		Department dept = getDeptById(deptId);
		chain.add(0, dept.getDeptName());
 
		while (dept.getParent() != null) {
			dept = dept.getParent(); // LAZY 로딩, 트랜잭션 내에서 자동 조회
			chain.add(0, dept.getDeptName());
		}
		chain.add(0, dept.getCompany().getComName());
		return chain;
	}
	
	// KJY 조직도 범위 제한
	//  상위 부서 체인 조회 (Department 엔티티 목록) - 조직도 범위 제한용
	public List<Department> getAncestorDepts(Long deptId) {
		List<Department> chain = new ArrayList<>();
		Department dept = getDeptById(deptId);
		chain.add(0, dept);
 
		while (dept.getParent() != null) {
			dept = dept.getParent();
			chain.add(0, dept);
		}
		return chain;
	}
	
	// 이관 이력 화면의 원부서/대상부서 필터 - 부서상태 무관 전체 목록
	public List<Department> getAllDeptsForFilter(Long comId) {
		return repo.findAllByCompany_IdOrderByDeptName(comId);
	}
	
	// 부서 코드 중복 체크
	public boolean isDuplicateDeptCode(Long comId, String deptCode) {
		return repo.selectDeptCode(comId, deptCode).isPresent();
	}
}
