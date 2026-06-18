package com.sb.erp.dto;

import lombok.Data;

@Data
public class ResourceDto {

    private int resId;           
    private int comId;           
    private String resCode;     
    private String resName;      
    private String resType;      
    private int quantity;        
    private String remark;       
    private String createdAt; 
    private String updatedAt; 

    
}