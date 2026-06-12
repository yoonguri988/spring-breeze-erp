package com.sb.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CompanyDto {
	private int companyId;
	private String companyNm;
	private String bizNo;
	private String tel;
	private String address;
	private String logoUrl;
	private String createdAt;
	private String updatedAt;
	private int isActive; 
}
