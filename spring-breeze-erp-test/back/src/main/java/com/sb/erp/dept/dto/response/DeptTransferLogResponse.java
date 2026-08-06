package com.sb.erp.dept.dto.response;

import lombok.Setter;
import lombok.ToString;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeptTransferLogResponse {
	private long logId;
	private long comId;
	//원부서
	private long originDeptId;
	private String originDeptName;
	//새부서
	private long targetDeptId;
	private String targetDeptName;
	//이관된 사원정보
	private long empId;
	private String empNo;
    private String empName;
	//ai 관련 정보
    private String aiRecommended;
	private String aiReason;
	private String handoverSnapshot;
	//이관 시킨 사원 정보 및 일자
	private long createdBy;
    private String createdByName;
    private String createdAt;
	
}
