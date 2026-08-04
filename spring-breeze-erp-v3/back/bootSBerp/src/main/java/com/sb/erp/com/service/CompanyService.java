package com.sb.erp.com.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import com.sb.erp.com.dto.CompanyDto.CompanyRequestDto;
import com.sb.erp.com.dto.CompanyDto.CompanyResponseDto;
import com.sb.erp.com.dto.CompanySearchDto;
import com.sb.erp.com.dto.StatsComDto;
import com.sb.erp.com.entity.Company;
import com.sb.erp.com.repository.CompanyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

	private final CompanyRepository repo;
	
	// 회사 등록
	@Transactional
	public CompanyResponseDto createCompany(CompanyRequestDto requestDto) {
		repo.findByBizNo(requestDto.getBizNo())
			.ifPresent(c -> {
				throw new IllegalArgumentException("이미 등록된 사업자 번호입니다.");
			});
		
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

	// 회사 단건 조회
	public CompanyResponseDto getCompany(Long id) {
		Company com = repo.findById(id)
				          .orElseThrow(()-> new IllegalArgumentException("존재하지 않는 회사입니다. ID="+id));
		return new CompanyResponseDto(com);
	}

	// 회사 목록 조회 (검색 + 페이징)
	public List<CompanyResponseDto> getAllCompanies(CompanySearchDto search) {
		Pageable pageable = PageRequest.of(
				Math.max(search.getPstartno() - 1, 0), // pstartno는 1-base, PageRequest는 0-base
				search.getOnepagelist());
 
		Page<Company> page = repo.search(
				emptyToNull(search.getKeyword()),
				emptyToNull(search.getIndustryGrpCode()),
				emptyToNull(search.getIndustryCode()),
				pageable);
 
		return page.getContent().stream()
				.map(CompanyResponseDto::new)
				.collect(Collectors.toList());
	}

	// 회사 수정
	@Transactional
	public CompanyResponseDto updateCompany(@PathVariable("id") Long id, CompanyRequestDto requestDto) {
		Company com = repo.findById(id)
		          .orElseThrow(()-> new IllegalArgumentException("존재하지 않는 회사입니다. ID="+id));
		
		// save 사용하지 않고 set* 만 사용해도 update 쿼리 반영
		com.setIndustryGrpCode(requestDto.getIndustryGrpCode());
		com.setIndustryCode(requestDto.getIndustryCode());
		com.setComName(requestDto.getComName());
		com.setComCeo(requestDto.getComCeo());
		com.setComCeo(requestDto.getComCeo());
		com.setComTel(requestDto.getComTel());
		com.setComLogo(requestDto.getComLogo());
		
		
		return new CompanyResponseDto(com);
	}

	// 회사 삭제
	@Transactional
	public void deleteCompany(Long id) {
		Company com = repo.findById(id)
				.orElseThrow(()-> new IllegalArgumentException("존재하지 않는 회사입니다. ID="+id));

		// TODO: Department 엔티티/레포지토리 완성되면 하위 부서 존재 여부 검증 추가
		// if (deptRepo.existsByCompany_Id(id)) {
		//     throw new IllegalArgumentException("하위 부서가 존재하는 경우, 회사 삭제가 불가능합니다.");
		// }
		
		repo.deleteById(id);
	}

	public Boolean checkBizNo(String bizNo) {
		return repo.findByBizNo(bizNo).isPresent();
	}

	public List<CompanySearchDto> getSuggest(String keyword) {
		return repo.findTop5ByComNameContainingOrderByComNameAsc(keyword).stream()
				.map(com -> new CompanySearchDto(com.getComId().intValue(), com.getComName()))
				.collect(Collectors.toList());
	}

	public StatsComDto getStats() {
		long comTotal = repo.count();
		long industTotal = repo.countDistinctIndustryCode();
		String comLatest = repo.findTopByOrderByCreatedAtDesc()
				.map(Company::getComName)
				.orElse(null);
 
		// TODO: Employee 엔티티/레포지토리 완성되면 실제 임직원 수로 교체
		int empTotal = 0;
 
		return StatsComDto.builder()
				.comTotal((int) comTotal)
				.empTotal(empTotal)
				.industTotal((int) industTotal)
				.comLatest(comLatest)
				.build();
	}
	
	// null 이거나 값이 비어 있다면 null
	private String emptyToNull(String value) {
		return (value == null || value.isEmpty()) ? null : value;
	}

}
