package com.sb.erp.res.dto.response;

import com.sb.erp.res.entity.Resource;

import lombok.Getter;

@Getter
public class ResResponse {
    private Long resId;           
    private Long comId;           
    private String resCode;     
    private String resName;      
    private String resType;      
    private Long quantity;
    
    private String location;
    private Long capacity;
    private String resStatus;
    
    private Long managerEmpId;
    private String managerEmpName;
    private String managerEmpNo;
    private String managerPosName;
    
    private String remark;       
    private String createdAt; 
    private String updatedAt;
    
    private Long resvCount;
    private Long totQuantity;
    private Long availQuantity;
    
	public ResResponse(Resource resource) {
		super();
		this.resId = resource.getResId();
		this.comId = resource.getCompany().getComId();
		this.resCode = resource.getResCode();
		this.resName = resource.getResName();
		this.resType = resource.getResType();
		this.quantity = resource.getQuantity();
		this.location = resource.getLocation();
		this.capacity = resource.getCapacity();
		this.resStatus = resource.getResStatus();
		this.managerEmpId = resource.getEmployee().getEmpId();
		this.managerEmpName = resource.getEmployee().getEmpName();
		this.managerEmpNo = resource.getEmployee().getEmpNo();
		this.managerPosName = resource.getEmployee().getPosition().getPosName();
		this.remark = resource.getRemark();
		this.createdAt = resource.getCreatedAt() != null ? resource.getCreatedAt().toString() : null;
		this.updatedAt = resource.getUpdatedAt() != null ? resource.getUpdatedAt().toString() : null;
	}

	public ResResponse(Long resvCount, Long totQuantity, Long availQuantity) {
		super();
		this.resvCount = resvCount;
		this.totQuantity = totQuantity;
		this.availQuantity = availQuantity;
	}
    
}
