package com.sb.erp.dept.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
public class DeptSearchRequest {
	private long comId;
	private long deptId;
	private String deptCode;
}
