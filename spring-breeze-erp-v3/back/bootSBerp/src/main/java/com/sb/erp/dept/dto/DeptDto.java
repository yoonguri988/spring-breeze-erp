package com.sb.erp.dept.dto;

import com.sb.erp.dept.entity.Department;

import lombok.Getter;
import lombok.Setter;

public class DeptDto {

	// 부서 등록/수정 - 요청 DTO
	@Getter @Setter
	public static class DeptRequestDto {
		private Long deptId; // 검색 조건 - 특정 부서 id
		private Long comId; // 소속 회사
		private Long parentId; // 상위 부서 id
		private String deptName; // 필수
		private String deptCode; // 필수
		private Integer sortOrder;
		private Long empId; // 부서장(담당자) - 선택
	}

	@Getter
	public static class DeptResponseDto {
		private Long deptId;
		private Long comId;
		private Long parentId;
		private Long empId;
		private String deptName;
		private String deptCode;
		private Integer depth;
		private Integer sortOrder;
		private String deptStatus; // ACTIVE, PENDING_DELETE, DELETED
		private boolean deleted;
		private String createdAt;
		private String updatedAt;
		
	    // 조회(JOIN) 결과 전용 - 주석 해제
	    private String parentName;
	    private String leaderName;
	    private Integer empCount;

	    // 상세 조회시에만 채워짐
	    private String leaderPosName;
	    private String leaderEmpNo;
	    
		// ===== StatsDeptDto.java 병합 (부서 통계 응답) =====
		private long deptTotal;
		private long dept0Total;
		private long dept1Total;
		private long dept2Total;
		private long empTotal;
		
		// insert, update, select 결과물
		public DeptResponseDto(Department department) {
			this.deptId = department.getDeptId();
			this.comId = department.getCompany().getId();
			this.parentId = department.getParent() != null ? department.getParent().getDeptId() : null;
			this.empId = department.getEmployee() != null ? department.getEmployee().getEmpId() : null;
			this.deptName = department.getDeptName();
			this.deptCode = department.getDeptCode();
			this.depth = department.getDepth();
			this.sortOrder = department.getSortOrder();
			this.deptStatus = department.getDeptStatus();
			this.deleted = department.isDeleted();
			this.createdAt = department.getCreatedAt() != null ? department.getCreatedAt().toString() : null;
			this.updatedAt = department.getUpdatedAt() != null ? department.getUpdatedAt().toString() : null;
		}
		
		// 삭제대기 부서 목록용 (Department + empCount)
		public DeptResponseDto(Department department, int empCount) {
			this(department);
			this.empCount = empCount;
		}			

		// selectAll(트리 목록) native query용 - 컬럼 순서와 1:1로 맞춘 생성자
		public DeptResponseDto(Long deptId, String deptName, String deptCode, Integer depth, Integer sortOrder,
				Long parentId, String parentName, Long empId, String leaderName, Integer empCount) {
			this.deptId = deptId;
			this.deptName = deptName;
			this.deptCode = deptCode;
			this.depth = depth;
			this.sortOrder = sortOrder;
			this.parentId = parentId;
			this.parentName = parentName;
			this.empId = empId;
			this.leaderName = leaderName;
			this.empCount = empCount;
		}
		
		// selectOneById(상세) native query용 - 컬럼 순서와 1:1로 맞춘 생성자
		public DeptResponseDto(Long deptId, String deptName, String deptCode, Integer depth, Integer sortOrder, Long comId,
				Long parentId, String parentName, Long empId, String leaderName,
				String leaderEmpNo, String leaderPosName, Integer empCount) {
			this.deptId = deptId;
			this.deptName = deptName;
			this.deptCode = deptCode;
			this.depth = depth;
			this.sortOrder = sortOrder;
			this.comId = comId;
			this.parentId = parentId;
			this.parentName = parentName;
			this.empId = empId;
			this.leaderName = leaderName;
			this.leaderEmpNo = leaderEmpNo;
			this.leaderPosName = leaderPosName;
			this.empCount = empCount;
		}

		// StatsDeptDto.java 대체 - 부서 통계 응답용
		public DeptResponseDto(long deptTotal, long dept0Total, long dept1Total, long dept2Total, long empTotal) {
			this.deptTotal = deptTotal;
			this.dept0Total = dept0Total;
			this.dept1Total = dept1Total;
			this.dept2Total = dept2Total;
			this.empTotal = empTotal;
		}
	}
}
