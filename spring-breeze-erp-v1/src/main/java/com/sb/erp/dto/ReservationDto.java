package com.sb.erp.dto;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class ReservationDto {

    private int revId;           
    private int resId;           
    private int comId;           
    private int empId;          
    private int quantity;        
    private String status;       
    private Timestamp reqDate;   
    private String remark;       
    private Timestamp updatedAt; 

   
    private String resName; 
    private String resCode; 
    private String empName; 
    private String deptName; 

    public ReservationDto() {
    }

    public int getRevId() {
        return revId;
    }

    public void setRevId(int revId) {
        this.revId = revId;
    }

    public int getResId() {
        return resId;
    }

    public void setResId(int resId) {
        this.resId = resId;
    }

    public int getComId() {
        return comId;
    }

    public void setComId(int comId) {
        this.comId = comId;
    }

    public int getEmpId() {
        return empId;
    }

    public void setEmpId(int empId) {
        this.empId = empId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getReqDate() {
        return reqDate;
    }

    public void setReqDate(Timestamp reqDate) {
        this.reqDate = reqDate;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getResName() {
        return resName;
    }

    public void setResName(String resName) {
        this.resName = resName;
    }

    public String getResCode() {
        return resCode;
    }

    public void setResCode(String resCode) {
        this.resCode = resCode;
    }

    public String getEmpName() {
        return empName;
    }

    public void setEmpName(String empName) {
        this.empName = empName;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }

    @Override
    public String toString() {
        return "ReservationDto [revId=" + revId + ", resId=" + resId + ", comId=" + comId
                + ", empId=" + empId + ", quantity=" + quantity + ", status=" + status
                + ", reqDate=" + reqDate + ", remark=" + remark + ", updatedAt=" + updatedAt
                + ", resName=" + resName + ", resCode=" + resCode + ", empName=" + empName
                + ", deptName=" + deptName + "]";
    }
}
