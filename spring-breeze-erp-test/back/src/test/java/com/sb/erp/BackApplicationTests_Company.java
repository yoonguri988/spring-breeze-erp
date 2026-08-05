package com.sb.erp;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.com.dto.request.ComRequest;
import com.sb.erp.com.repository.CompanyMapper;

@SpringBootTest
@MapperScan("com.sb.erp.com.repository")
@Transactional
class BackApplicationTests_Company {

	@Autowired CompanyMapper mapper;
	
	@Test
	@DisplayName("회사 등록")
	void testInsert() {
		//ComRequest dto = new ComRequest();
		ComRequest dto = ComRequest.builder().industryGrpCode("G")
		             .industryCode("12345")
		             .comName("test")
		             .comCeo("김도훈")
		             .bizNo("123-45-12345").build();
		
		int res = mapper.insert(dto);
		assertThat(res).isEqualTo(1);
	}
	
//	@Test
//	@DisplayName("회사 여러개 조회")
//	void testFindAll() {
//		CompanySearchRequest search = new CompanySearchRequest();
//		search.setKeyword("t");
//		
//		List<ComResponse> list = mapper.selectAll(search);
//		assertThat(list.get(0).getComName()).isEqualTo("test");
//	}

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
			factoryBean.setTypeAliasesPackage("com.sb.erp.com.dto");
			return factoryBean.getObject();
		}

		@Bean
		public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
			return new SqlSessionTemplate(sqlSessionFactory);
		}
	}

}
