package com.sb.erp.resv.dto.reponse;

import java.time.LocalDateTime;

import com.sb.erp.resv.entity.Reservation;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @NoArgsConstructor
public class ResvResponse {
    private long revId;
    private long resId;
    private long comId;
    private long empId;
    
    private long quantity;
    private String status;
    
    //추가 컬럼
    private LocalDateTime startDt;
    private LocalDateTime endDt;
    private LocalDateTime returnDt;
    private long approvedEmpId;
    private LocalDateTime approvedAt;
    private String rejectReason;
    
    private String remark;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    //
    private String resName;
    private String resCode;
    private String resType;
    private String location;
    
    private String empName;
    private String deptName;
    private String approvedEmpName;
    
	public ResvResponse(Reservation reservation) {
		super();
		this.revId = reservation.getRevId();
		this.resId = reservation.getResource().getResId();
		this.comId = reservation.getCompany().getComId();
		this.empId = reservation.getEmployee().getEmpId();
		this.quantity = reservation.getQuantity();
		this.status = reservation.getStatus();
		this.startDt = reservation.getStartDt();
		this.endDt = reservation.getEndDt();
		this.returnDt =  reservation.getReturnDt() != null ? reservation.getReturnDt() : null;
		this.approvedEmpId = reservation.getApprEmployee() != null? reservation.getApprEmployee().getEmpId(): null;
		this.approvedAt = reservation.getApprovedAt() != null? reservation.getApprovedAt(): null;
		this.rejectReason = reservation.getRejectReason() != null? reservation.getRejectReason(): null;
		this.remark = reservation.getRemark();
		this.createdAt = reservation.getCreatedAt() != null ? reservation.getCreatedAt() : null;
		this.updatedAt = reservation.getUpdatedAt() != null ? reservation.getUpdatedAt() : null;
		this.resName = reservation.getResource().getResName();
		this.resCode = reservation.getResource().getResCode();
		this.resType = reservation.getResource().getResType();
		this.location = reservation.getResource().getLocation();
		this.empName = reservation.getEmployee().getEmpName();
		this.deptName = reservation.getEmployee().getDepartment().getDeptName();
		this.approvedEmpName = reservation.getApprEmployee().getEmpName();
	}
    
    
}
