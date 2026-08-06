package com.sb.erp.appr.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @NoArgsConstructor
public class ApprLineImpactResponse {
    private Long linId;
    private Long docId;
    private String docTitle;
    private Long empId;
    private String empName;
    private Integer linOrder;
    private String linStatus;
    
	public ApprLineImpactResponse(Long linId, Long docId, String docTitle, Long empId, String empName, Integer linOrder,
			String linStatus) {
		super();
		this.linId = linId;
		this.docId = docId;
		this.docTitle = docTitle;
		this.empId = empId;
		this.empName = empName;
		this.linOrder = linOrder;
		this.linStatus = linStatus;
	}
    
}
