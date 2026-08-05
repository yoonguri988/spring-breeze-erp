package com.sb.erp.com.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sb.erp.com.entity.Company;

@Repository                                             //Entity, PK의 자료형
public interface CompanyRepository  extends JpaRepository<Company, Long> {
	// 사업자 번호 중복 확인
	Optional<Company> findByBizNo(String bizno);
	
	// 회사명 자동완성 - keyword, 이름순 상위 5건
	List<Company> findTop5ByComNameContainingOrderByComNameAsc(String keyword);
	
	// 가장 최근에 등록된 회사 (통계 - comLatest)
	Optional<Company> findTopByOrderByCreatedAtDesc();
	
	// 전체 업종 수 (중복제거, 통계 - industTotal)
	@Query("select count(distinct c.industryCode) from Company c")
	long countDistinctIndustryCode();
	
	// 목록 검색 (키워드 + 업종그룹/업종코드) + 페이징
	// 파라미터가 null이면 해당 조건은 무시하고 전체 대상으로 검색한다.
	@Query(value = """
			select c from Company c
			where (:keyword is null or lower(c.comName) like lower(concat('%', :keyword, '%')))
			  and (:industryGrpCode is null or c.industryGrpCode = :industryGrpCode)
			  and (:industryCode is null or c.industryCode = :industryCode)
			order by c.id desc
			""")
	Page<Company> search(@Param("keyword") String keyword,
			@Param("industryGrpCode") String industryGrpCode, 
			@Param("industryCode") String industryCode,
			Pageable pageable
	);	
}

//create - save: insert into app_user (컬럼,,,) values (?,,,)
//read   - findAll  : select * from app_user
//       findById : select * from app_user where id=?
//update - save : update app_user set 컬럼=?,,, where id=?
//delete - deleteById : delete app_user where id=?