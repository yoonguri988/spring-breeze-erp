package com.sb.erp.dto;

import java.sql.Timestamp;

/**
 * reservation 테이블에 대응하는 DTO
 * 화면 표시를 위해 resource, employee 테이블의 일부 컬럼(이름)도 같이 담는다.
 * (DB 컬럼은 아니고, JOIN 결과를 받기 위한 필드)
 */
public class ReservationDto {

    private int revId;           // 예약 ID (PK, 자동증가)
    private int resId;           // 자원 ID (FK -> resource.res_id)
    private int comId;           // 회사 ID (FK -> company.com_id)
    private int empId;           // 사원 ID (FK -> employee.emp_id)
    private int quantity;        // 예약(요청) 수량
    private String status;       // 상태값: WAI(대기) / APP(승인) / REJ(반려)
    private Timestamp reqDate;   // 요청일시
    private String remark;       // 비고 (반려 사유 등)
    private Timestamp updatedAt; // 수정일시

    // ---- 목록/상세 화면에 같이 보여줄 조인 컬럼 ----
    private String resName; // resource.res_name
    private String resCode; // resource.res_code
    private String empName; // employee.emp_name
    private String deptName; // department.dept_name

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
