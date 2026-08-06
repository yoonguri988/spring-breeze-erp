package com.sb.erp.dept.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeptRequest {
	private long deptId; // 검색 조건 - 특정 부서 id
	private long comId; // 소속 회사
	private long parentId; // 상위 부서 id
	private String deptName; // 필수
	private String deptCode; // 필수
	private long sortOrder;
	private long empId; // 부서장(담당자) - 선택
	private long depth;
}
