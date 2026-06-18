package com.sb.erp.dto;

import java.sql.Timestamp;

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
    private Timestamp createdAt; 
    private Timestamp updatedAt; 

    public ResourceDto() { } 
    
    public int getResId() { return resId; } 
    
    public void setResId(int resId) { this.resId = resId; } 
    
    public int getComId() { return comId; }  
    
    public void setComId(int comId) { this.comId = comId; }  
    
    public String getResCode() { return resCode; }  
    
    public void setResCode(String resCode) { this.resCode = resCode; }  
    
    public String getResName() { return resName; }  
    
    public void setResName(String resName) { this.resName = resName; }  
    
    public String getResType() { return resType; }  
    
    public void setResType(String resType) { this.resType = resType; }  
    
    public int getQuantity() { return quantity; }  
    
    public void setQuantity(int quantity) { this.quantity = quantity; }  
    
    public String getRemark() { return remark; }  
    
    public void setRemark(String remark) { this.remark = remark; }  
    
    public Timestamp getCreatedAt() { return createdAt; }  
    
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }  
    
    public Timestamp getUpdatedAt() { return updatedAt; }  
    
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "ResourceDto [resId=" + resId + ", comId=" + comId + ", resCode=" + resCode
                + ", resName=" + resName + ", resType=" + resType + ", quantity=" + quantity
                + ", remark=" + remark + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + "]";
    }
}