package com.sb.erp.emp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmpTransferResponse {
	private Long empId;
	private String empNo;
	private String empName;
	private String posName;
	private Integer posOrder;
	private String empStatus;
}