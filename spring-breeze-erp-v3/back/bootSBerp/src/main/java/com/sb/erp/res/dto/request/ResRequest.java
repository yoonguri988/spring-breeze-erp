package com.sb.erp.res.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ResRequest {
    private Long comId;           
    private String resCode;     
    private String resName;      
    private String resType;      
    private Long quantity; 
    
    private String location;  // 필수 아님
    private Integer capacity; // 필수 아님
    private String resStatus;
    
    private Long managerEmpId; // 필수 아님
    private String remark;     // 필수 아님  
}
