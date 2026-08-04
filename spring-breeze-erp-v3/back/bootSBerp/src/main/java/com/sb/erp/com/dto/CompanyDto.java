package com.sb.erp.com.dto;

import com.sb.erp.com.entity.Company;

import lombok.Getter;
import lombok.Setter;

public class CompanyDto {

	// 회사 등록/수정 - 요청 DTO
	@Setter @Getter
	public static class CompanyRequestDto {
		private String industryGrpCode;
		private String industryCode;
		private String comName;
		private String comCeo;
		private String bizNo;
		private String comTel;  // 필수 아님
		private String comLogo; // 필수 아님
	}

	// 회사 정보 - 응답 DTO
	@Getter
	public static class CompanyResponseDto {
		private Long id;
		private String industryGrpCode;
		private String industryCode;
		private String comName;
		private String comCeo;
		private String bizNo;
		private String comTel;
		private String comLogo;
		private String createdAt;
		private String updatedAt;
		private int empCount; // 목록조회 시 임직원수

		// insert, update, select 결과물
		public CompanyResponseDto(Company company) { 
			this.id = company.getComId();
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
	}
}