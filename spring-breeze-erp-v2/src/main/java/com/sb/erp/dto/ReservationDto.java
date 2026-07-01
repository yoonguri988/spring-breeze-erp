package com.sb.erp.dto;

import lombok.Data;

@Data
public class ReservationDto {
    private int revId;
    private int resId;
    private int comId;
    private int empId;
    private int quantity;
    private String status;
    private String reqDate;
    private String remark;
    private String updatedAt;
    private String resName;
    private String resCode;
    private String empName;
    private String deptName;
}
