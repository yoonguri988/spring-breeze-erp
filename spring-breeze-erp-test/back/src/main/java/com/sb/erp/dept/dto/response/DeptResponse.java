package com.sb.erp.dept.dto.response;

import java.util.ArrayList;
import java.util.List;

import com.sb.erp.dept.entity.Department;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class DeptResponse {
	private long deptId;
	private long comId;
	private long parentId;
	private long empId;
	private String deptName;
	private String deptCode;
	private long depth;
	private long sortOrder;
	private String deptStatus; // ACTIVE, PENDING_DELETE, DELETED
	private boolean deleted;
	private String createdAt;
	private String updatedAt;
	
    // 조회(JOIN) 결과 전용 - 주석 해제
    private String parentName;
    private String leaderName;
    private long empCount;

    // 상세 조회시에만 채워짐
    private String leaderPosName;
    private String leaderEmpNo;
    
    private List<DeptResponse> children;
    
	public List<DeptResponse> getChildren() {
		if(this.children == null) this.children = new ArrayList<>();
		return this.children;
	}
    
    public DeptResponse(Department department) {
		this.deptId = department.getDeptId();
		this.comId = department.getCompany().getComId();
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
    public DeptResponse(Department department, int empCount) {
    	this(department);
 		this.empCount = empCount;
    }	
}
