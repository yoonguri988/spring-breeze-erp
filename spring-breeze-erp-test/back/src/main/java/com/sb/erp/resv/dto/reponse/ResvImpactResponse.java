package com.sb.erp.resv.dto.reponse;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @NoArgsConstructor
public class ResvImpactResponse {
    private Long revId;
    private Long empId;
    private String empName;
    private Long resId;
    private String resName;
    private String status;
    private String startDt;
    private String endDt;
    
	public ResvImpactResponse(Long revId, Long empId, String empName, Long resId, String resName, String status,
			String startDt, String endDt) {
		super();
		this.revId = revId;
		this.empId = empId;
		this.empName = empName;
		this.resId = resId;
		this.resName = resName;
		this.status = status;
		this.startDt = startDt;
		this.endDt = endDt;
	}
}
