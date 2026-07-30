package com.sb.erp.com.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.com.dto.CompanyDto.CompanyRequestDto;
import com.sb.erp.com.dto.CompanyDto.CompanyResponseDto;
import com.sb.erp.com.entity.Company;
import com.sb.erp.com.repository.CompanyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

	private final CompanyRepository repo;
	
	@Transactional
	public CompanyResponseDto add(CompanyRequestDto requestDto) {
		if(requestDto.getBizNo() != null && repo.findByBizNo(requestDto.getBizNo()) != null) {
			throw new IllegalArgumentException("중복된 사업자 번호");
		}
		
		Company com = Company.builder()
			       			 .industryGrpCode(requestDto.getIndustryGrpCode())
			    			 .industryCode(requestDto.getIndustryCode())
			    			 .comName(requestDto.getComName())
			    			 .comCeo(requestDto.getComCeo())
			    			 .bizNo(requestDto.getBizNo())
			    			 .comTel(requestDto.getComTel())
			    			 .comLogo(requestDto.getComLogo())
			    			 .build();
		
		
		Company savedCom = repo.save(com);
		return new CompanyResponseDto(savedCom);
	}
}
