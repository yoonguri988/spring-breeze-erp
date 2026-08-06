package com.sb.erp.api.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AiRecomResponse {
    private long targetDeptId;
 // 서비스에서 candidates 목록과 매칭해 채워줌 (화면 표시용)
    private String targetDeptName; 
    private String reason;
    
	public AiRecomResponse(long targetDeptId, String targetDeptName, String reason) {
		super();
		this.targetDeptId = targetDeptId;
		this.targetDeptName = targetDeptName;
		this.reason = reason;
	}
}
