package com.sb.erp;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.com.dto.request.ComRequest;
import com.sb.erp.com.dto.request.CompanySearchRequest;
import com.sb.erp.com.dto.response.ComResponse;
import com.sb.erp.com.dto.response.StatsComResponse;
import com.sb.erp.com.repository.CompanyMapper;

@SpringBootTest
@MapperScan("com.sb.erp.com.repository")
@Transactional
class BackApplicationTests_Company {

	@Autowired CompanyMapper mapper;
	
	// 여러 테스트에서 공통으로 재사용할 등록된 회사의 PK
	private long savedComId1;
	private long savedComId2;
	
	@BeforeEach
	void setUp() {
		// 매 테스트 실행 전, 조회/수정/삭제 테스트에서 사용할 기준 데이터를 하나 등록해둔다.
		ComRequest dto1 = ComRequest.builder()
				.industryGrpCode("G")
				.industryCode("12345")
				.comName("test")
				.comCeo("도훈")
				.bizNo("152-45-12345")
				.build();
		ComRequest dto2 = ComRequest.builder()
				.industryGrpCode("J")
				.industryCode("54321")
				.comName("kkk")
				.comCeo("신유")
				.bizNo("588-98-12345")
				.build();
 
		int res1 = mapper.insert(dto1);
		assertThat(res1).isEqualTo(1);
		int res2 = mapper.insert(dto2);
		assertThat(res2).isEqualTo(1);
 
		savedComId1 = dto1.getComId();
		assertThat(savedComId1).isNotNull();
		savedComId2 = dto2.getComId();
		assertThat(savedComId2).isNotNull();
	}
	
	@Test
	@DisplayName("회사 목록 조회 (검색/페이징)")
	void testSelectAll() {
		CompanySearchRequest req = CompanySearchRequest.builder()
				.industryGrpCode("G")
				.keyword("t")
				.pstartno(0)
				.onepagelist(10)
				.build();
		
		List<ComResponse> list = mapper.selectAll(req);
 
		assertThat(list.get(0).getComName()).isEqualTo("test");
	}
	
	@Test
	@DisplayName("회사 목록 총 건수 조회")
	void testListTotal() {
		CompanySearchRequest req = CompanySearchRequest.builder()
				.keyword("123")
				.build();
 
		int total = mapper.listTotal(req);
 
		assertThat(total).isGreaterThanOrEqualTo(2);
	}
	
	@Test
	@DisplayName("회사명/사업자번호 자동완성 검색")
	void testSelectSuggest() {
		List<ComResponse> list = mapper.selectSuggest("t");
 
		assertThat(list.size()).isEqualTo(1);
	}
	
	@Test
	@DisplayName("회사 등록")
	void testInsert() {
		ComRequest dto = ComRequest.builder()
				.industryGrpCode("S")
				.industryCode("54321")
				.comName("insert-test")
				.comCeo("홍길동")
				.bizNo("999-99-99999")
				.build();
 
		int res = mapper.insert(dto);
 
		assertThat(res).isEqualTo(1);
		assertThat(dto.getComId()).isNotNull(); 
	}
	
	@Test
	@DisplayName("사업자번호로 단건 조회")
	void testSelectByBizNo() {
		ComResponse response = mapper.selectByBizNo("152-45-12345");
 
		assertThat(response).isNotNull();
		assertThat(response.getComName()).isEqualTo("test");
		assertThat(response.getComCeo()).isEqualTo("도훈");
	}
	
	@Test
	@DisplayName("com_id로 단건 조회")
	void testSelectOneById() {
		ComResponse response = mapper.selectOneById(savedComId1);
 
		assertThat(response).isNotNull();
		assertThat(response.getComId()).isEqualTo(savedComId1);
		assertThat(response.getComName()).isEqualTo("test");
	}
	
	@Test
	@DisplayName("회사 정보 수정")
	void testUpdate() {
		ComRequest updateDto = ComRequest.builder()
				.comId(savedComId1)
				.comName("updated-name")
				.comCeo("김수정")
				.build();
 
		int res = mapper.update(updateDto);
		assertThat(res).isEqualTo(1);
 
		ComResponse response = mapper.selectOneById(savedComId1);
		assertThat(response.getComName()).isEqualTo("updated-name");
		assertThat(response.getComCeo()).isEqualTo("김수정");
		// <if> 로 넘기지 않은 필드는 기존 값 유지 확인
		assertThat(response.getBizNo()).isEqualTo("152-45-12345");
	}
	
	@Test
	@DisplayName("회사 삭제")
	void testDelete() {
		int res = mapper.delete(savedComId1);
		assertThat(res).isEqualTo(1);
 
		ComResponse response = mapper.selectOneById(savedComId1);
		assertThat(response).isNull();
	}
	
	@Test
	@DisplayName("회사 통계 조회")
	void testSelectStats() {
		StatsComResponse stats = mapper.selectStats();
 
		assertThat(stats).isNotNull();
		assertThat(stats.getComTotal()).isGreaterThanOrEqualTo(1);
	}
	
	@Test
	@DisplayName("사원 id로 소속 회사 조회")
	void testSelectOneByEmpId() {
		// 사전에 employee 테이블에 savedComId 를 가진 사원 데이터가 있어야 정상 통과합니다.
		// (해당 사원 seed 데이터가 없다면 이 테스트는 별도 준비 데이터에 맞춰 empId 값을 조정하세요.)
		int empId = 1;
 
		ComResponse response = mapper.selectOneByEmpId(empId);
		assertThat(response).isNotNull();
	}
	
	//  MyBatis 설정
	@TestConfiguration
	static class MyBatisTestConfig {

		@Autowired
		private DataSource dataSource;

		@Bean
		public SqlSessionFactory sqlSessionFactory() throws Exception {
			SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
			factoryBean.setDataSource(dataSource);
			factoryBean.setMapperLocations(
				new PathMatchingResourcePatternResolver()
		           .getResources("classpath:mapper/company-mapper.xml")
			);
			//com.sb.erp.com.dto.request, com.sb.erp.com.dto.response
			factoryBean.setTypeAliasesPackage("com.sb.erp.com.dto");
			factoryBean.setConfigLocation(
					new ClassPathResource("mybatis-config.xml")  // ← 이 줄 추가
			);
			return factoryBean.getObject();
		}

		@Bean
		public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
			return new SqlSessionTemplate(sqlSessionFactory);
		}
	}

}
