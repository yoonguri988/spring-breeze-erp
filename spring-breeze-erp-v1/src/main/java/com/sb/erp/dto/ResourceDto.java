package com.sb.erp.dto;

import java.sql.Timestamp;

/**
 * resource 테이블에 대응하는 DTO
 * 자원 목록 / 상세 / 등록 / 수정 화면에서 공통으로 사용한다.
 */
public class ResourceDto {

    private int resId;           // 자원 ID (PK, 자동증가)
    private int comId;           // 회사 ID (FK -> company.com_id)
    private String resCode;      // 자원 코드 (예: PC-P)
    private String resName;      // 자원명 (예: 듀얼모니터)
    private String resType;      // 자원 타입 (ENUM, 팀에서 정한 값)
    private int quantity;        // 보유 수량
    private String remark;       // 비고 (없으면 null)
    private Timestamp createdAt; // 등록일시
    private Timestamp updatedAt; // 수정일시

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