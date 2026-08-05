package com.sb.erp.com.dto.response;

import com.sb.erp.com.entity.Company;

import lombok.Getter;

@Getter
public class ComResponse {
	private long comId;
	private String industryGrpCode;
	private String industryCode;
	private String comName;
	private String comCeo;
	private String bizNo;
	private String comTel;
	private String comLogo;
	private String createdAt;
	private String updatedAt;
	
	private long empCount; // 목록조회 시 임직원수

	public ComResponse(Company company) { 
		this.comId = company.getComId();
		this.industryGrpCode = company.getIndustryGrpCode();
		this.industryCode = company.getIndustryCode();
		this.comName = company.getComName();
		this.comCeo = company.getComCeo();
		this.bizNo = company.getBizNo();
		this.comTel = company.getComTel();
		this.comLogo = company.getComLogo();
		this.createdAt = company.getCreatedAt() != null ? company.getCreatedAt().toString() : null;
		this.updatedAt = company.getUpdatedAt() != null ? company.getUpdatedAt().toString() : null;
	}

	public ComResponse(Long empCount) {
		super();
		this.empCount = empCount;
	}
	
}
