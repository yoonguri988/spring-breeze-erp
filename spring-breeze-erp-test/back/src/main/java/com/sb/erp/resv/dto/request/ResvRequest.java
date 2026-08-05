package com.sb.erp.resv.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ResvRequest {
    private Integer revId;
    private Integer resId;
    private Integer comId;
    private Integer empId;
    
    private Integer quantity;
    private String status;
    
    //추가 컬럼
    private String startDt;
    private String endDt;
    private String returnDt;
    private Integer approvedEmpId;
    private String approvedAt;
    private String rejectReason;
    
    private String remark;
    private String createdAt;
    private String updatedAt;
}
