package com.sb.erp.appr.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @NoArgsConstructor
public class ApprDocImpactResponse {
    private Long docId;
    private String docTitle;
    private Long empId;
    private String empName;
    private String docStatus;
    
	public ApprDocImpactResponse(Long docId, String docTitle, Long empId, String empName, String docStatus) {
		super();
		this.docId = docId;
		this.docTitle = docTitle;
		this.empId = empId;
		this.empName = empName;
		this.docStatus = docStatus;
	}
}
