package com.sb.erp.dto;

import lombok.Setter;
import lombok.ToString;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class DeptTransferLogDto {
	private Integer comId;
	private Integer originDeptId;
	private Integer targetDeptId;
	private Integer empId;
	private String aiRecommended;
	private String aiReason;
	private String handoverSnapshot;
	private Integer createdBy;
	
}
