package com.sb.erp.dept.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeptTransferLogSearchRequest {
    private long originDeptId; //원부서
    private long targetDeptId; //대상부서
    // "Y" | "N" | null(전체)
    private String aiRecommended; // ai 제안여부   
    private String dateFrom;      // 처리시작일자
    private String dateTo;        // 처리종료일자
    
    // 페이지 네이션
    private int pstartno = 1;
    private int onepagelist = 10;
}
