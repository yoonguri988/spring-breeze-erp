package com.sb.erp.res.dto.response;

import lombok.Getter;

@Getter
public class ResResponse {
    private Integer resId;           
    private Integer comId;           
    private String resCode;     
    private String resName;      
    private String resType;      
    private Integer quantity;
    
    private String location;
    private Integer capacity;
    private String resStatus;
    
    private Integer managerEmpId;
    private String managerEmpName;
    private String managerEmpNo;
    private String managerPosName;
    
    private String remark;       
    private String createdAt; 
    private String updatedAt;
    
    private Integer resvCount;
    private Integer totQuantity;
    private Integer availQuantity;
}
