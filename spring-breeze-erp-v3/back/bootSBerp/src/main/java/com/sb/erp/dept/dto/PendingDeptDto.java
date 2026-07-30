package com.sb.erp.dept.dto;

import com.sb.erp.dept.entity.Department;

import lombok.Getter;
import lombok.NoArgsConstructor;

// Response
@Getter @NoArgsConstructor
public class PendingDeptDto {
    private Long deptId;
    private String deptName;
    private String deptCode;
    private Integer empCount;
    private String updatedAt; 
    // dept_status가 PENDING_DELETE로 바뀐 시점 (department.updated_at 재사용)
    
    // select 결과물
 	public PendingDeptDto(Department department, int empCount) {
 		this.deptId = department.getId();
 		this.deptName = department.getDeptName();
 		this.deptCode = department.getDeptCode();
 		this.empCount = empCount;
 		this.updatedAt = department.getUpdatedAt() != null ? department.getUpdatedAt().toString() : null;
 	}
}
