package com.sb.erp.dept.dto;

import java.util.ArrayList;
import java.util.List;

import com.sb.erp.dept.entity.Department;
//import com.sb.erp.dept.repository.DeptDetailRow;
//import com.sb.erp.dept.repository.DeptTreeRow;

import lombok.Getter;
import lombok.Setter;

public class DeptDto {
	
	@Setter @Getter
	public static class DeptRequestDto {
		private Long comId;      // 소속 회사
		private Long parentId;   // 상위 부서 id
		private String deptName; // 필수
		private String deptCode; // 필수
		private Integer sortOrder;
		private Long empId;      // 부서장(담당자) - 선택
	}
	
	@Getter
	public static class DeptResponseDto {
		private Long id;
		private Long comId;
		private Long parentId;
		private String deptName;
		private String deptCode;
		private Integer depth;
		private Integer sortOrder;
		private String deptStatus; // ACTIVE, PENDING_DELETE, DELETED
		private boolean deleted;
		
		// TODO: EMPLOYEE(empId)
		private Long leaderId;
		private String createdAt;
		private String updatedAt;
 
		// 부서 조회시 불러오는 추가 데이터 (조인 결과, 생성자에서 세팅)
		private String parentName;
		private String leaderName;
		private int empCount;
 
		// 부서 상세 조회시에만 채워지는 데이터
		private String leaderPosName;
		private String leaderEmpNo;
 
		// 트리 구성용 (DB 컬럼 아님, 서비스에서 세팅)
		@Setter
		private String fullPath;
		@Setter
		private List<DeptResponseDto> children;
		
		// insert, update, select(단건) 결과물
//		public DeptResponseDto(Department department) {
//			this.id = department.getId();
//			this.comId = department.getCompany() != null ? department.getCompany().getId() : null;
//			this.parentId = department.getParent() != null ? department.getParent().getId() : null;
//			this.deptName = department.getDeptName();
//			this.deptCode = department.getDeptCode();
//			this.depth = department.getDepth();
//			this.sortOrder = department.getSortOrder();
//			this.deptStatus = department.getDeptStatus();
//			this.deleted = department.isDeleted();
//			// TODO: Department에 manager(Employee) 필드가 복원되면 leaderId 세팅 추가
//			// this.leaderId = department.getManager() != null ?
//			// department.getManager().getEmpId() : null;
//			this.createdAt = department.getCreatedAt() != null ? department.getCreatedAt().toString() : null;
//			this.updatedAt = department.getUpdatedAt() != null ? department.getUpdatedAt().toString() : null;
//		}
//		
//		// 부서 목록/트리 조회 결과물 (부모명, 부서장명, 인원수까지 조인해서 내려줄 때)
//		public DeptResponseDto(Department department, String parentName, String leaderName, int empCount) {
//			this(department);
//			this.parentName = parentName;
//			this.leaderName = leaderName;
//			this.empCount = empCount;
//		}		
//		
//		// 부서 상세 조회 결과물 (부서장 직급/사번까지 포함)
//		public DeptResponseDto(Department department, String parentName, String leaderName, String leaderPosName,
//				String leaderEmpNo, int empCount) {
//			this(department, parentName, leaderName, empCount);
//			this.leaderPosName = leaderPosName;
//			this.leaderEmpNo = leaderEmpNo;
//		}
//		
//		// 부서 트리 조회 native query 결과물 (DepartmentRepository#findDeptTree)
//		public DeptResponseDto(DeptTreeRow row) {
//			this.id = row.getDeptId();
//			this.parentId = row.getParentId();
//			this.parentName = row.getParentName();
//			this.deptName = row.getDeptName();
//			this.deptCode = row.getDeptCode();
//			this.depth = row.getDepth();
//			this.sortOrder = row.getSortOrder();
//			this.leaderId = row.getLeaderId();
//			this.leaderName = row.getLeaderName();
//			this.empCount = row.getEmpCount() != null ? row.getEmpCount().intValue() : 0;
//		}
//		
//		// 부서 상세 조회 native query 결과물 (DepartmentRepository#findDeptDetail)
//		public DeptResponseDto(DeptDetailRow row) {
//			this.id = row.getDeptId();
//			this.comId = row.getComId();
//			this.parentId = row.getParentId();
//			this.parentName = row.getParentName();
//			this.deptName = row.getDeptName();
//			this.deptCode = row.getDeptCode();
//			this.depth = row.getDepth();
//			this.sortOrder = row.getSortOrder();
//			this.leaderId = row.getLeaderId();
//			this.leaderName = row.getLeaderName();
//			this.leaderEmpNo = row.getLeaderEmpNo();
//			this.leaderPosName = row.getLeaderPosName();
//			this.empCount = row.getEmpCount() != null ? row.getEmpCount().intValue() : 0;
//		}
// 
//		public List<DeptResponseDto> getChildren() {
//			if (this.children == null) {
//				this.children = new ArrayList<>();
//			}
//			return this.children;
//		}
	}
}
