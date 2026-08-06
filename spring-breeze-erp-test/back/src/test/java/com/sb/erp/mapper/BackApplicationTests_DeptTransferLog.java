package com.sb.erp.mapper;

import static org.assertj.core.api.Assertions.assertThat;

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
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.com.dto.request.ComRequest;
import com.sb.erp.com.repository.CompanyMapper;
import com.sb.erp.dept.dto.request.DeptRequest;
import com.sb.erp.dept.repository.DeptMapper;
import com.sb.erp.dept.repository.DeptTransferLogMapper;
import com.sb.erp.dept.repository.DeptTransferMapper;

@SpringBootTest
@MapperScan({"com.sb.erp.dept.repository", "com.sb.erp.com.repository"})
@Transactional
class BackApplicationTests_DeptTransferLog {

	@Autowired DeptMapper mapper;
	@Autowired CompanyMapper comMapper;
	@Autowired DeptTransferMapper deptTrasfer;
	@Autowired DeptTransferLogMapper deptTrasferLog;

	// 여러 테스트에서 공통으로 재사용할 등록된 회사의 PK
	private long savedComId;

	private long savedRootDeptId;
	private long savedChildDeptId;

	// 이관 대상 사원 / 이관 처리자(승인자) 사원
	private long targetEmpId;
	private long createdByEmpId;

	@BeforeEach
	void setUp() {
		// 기준 회사 등록
		ComRequest dto1 = ComRequest.builder()
				.industryGrpCode("G")
				.industryCode("12345")
				.comName("test")
				.comCeo("도훈")
				.bizNo("152-45-12345")
				.build();

		int res1 = comMapper.insert(dto1);
		assertThat(res1).isEqualTo(1);

		savedComId = dto1.getComId();
		assertThat(savedComId).isNotNull();

		// 기준 부서 트리 등록: root(depth:0) -> child(depth:1)
		DeptRequest root = DeptRequest.builder()
				.comId(savedComId).parentId(0).deptName("베이스부서").deptCode("BASE0").depth(0).sortOrder(1).build();
		savedRootDeptId = insertDeptAndGetId(root);

		DeptRequest child = DeptRequest.builder()
				.comId(savedComId).parentId(savedRootDeptId).deptName("베이스하위부서").deptCode("BASE1").depth(1).sortOrder(1).build();
		savedChildDeptId = insertDeptAndGetId(child);

		// TODO: EmpMapper 추가되면 아래 두 줄로 사원 데이터 등록
		// 이관 로그 조회 시 조인되는 사원 데이터 등록 (이관대상자 / 처리자)
		// targetEmpId = empMapper.insert(EmpRequest.builder()...);
		// createdByEmpId = empMapper.insert(EmpRequest.builder()...);
		
		// TODO: 부서 이관 로그 1건 삽입 헬퍼 작성
	}

	private long insertDeptAndGetId(DeptRequest dto) {
		int res = mapper.insert(dto);
		assertThat(res).isEqualTo(1);
		assertThat(dto.getDeptId()).isGreaterThan(0);
		return dto.getDeptId();
	}

	@Test
	@DisplayName("부서 이관 로그 삽입 성공")
	void insertTransferLog_성공() {
		// TODO: EmpMapper 추가되면 구현 (emp_id/created_by가 employee FK라 유효한 사원 필요)
	}
 
	@Test
	@DisplayName("검색조건 없이 전체 이관 로그 조회 시 조인 데이터까지 정상 매핑된다")
	void searchTransferLogs_필터없이_전체조회() {
		// TODO: EmpMapper 추가되면 구현 (employee 조인 컬럼 empNo/empName/createdByName 검증 필요)
	}
 
	@Test
	@DisplayName("origin/target 부서ID로 필터링하여 조회한다")
	void searchTransferLogs_부서필터() {
		// TODO: EmpMapper 추가되면 구현
	}
 
	@Test
	@DisplayName("aiRecommended 값으로 필터링하여 조회한다")
	void searchTransferLogs_AI추천여부_필터() {
		// TODO: EmpMapper 추가되면 구현
	}
 
	@Test
	@DisplayName("dateFrom ~ dateTo 기간으로 필터링하여 조회한다")
	void searchTransferLogs_기간필터() {
		// TODO: EmpMapper 추가되면 구현
	}
 
	@Test
	@DisplayName("listTotal은 검색조건이 동일할 때 실제 목록 건수와 일치한다")
	void listTotal_카운트일치() {
		// TODO: EmpMapper 추가되면 구현
	}
 
	@Test
	@DisplayName("OFFSET/FETCH 페이징이 정상 동작한다")
	void searchTransferLogs_페이징() {
		// TODO: EmpMapper 추가되면 구현
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
					new ClassPathResource("mapper/dept-mapper.xml"),
				    new ClassPathResource("mapper/deptlog-mapper.xml"),
				    new ClassPathResource("mapper/company-mapper.xml")
			);
		    factoryBean.setTypeAliasesPackage("com.sb.erp.dept.dto,com.sb.erp.com.dto,com.sb.erp.emp.dto");
			factoryBean.setConfigLocation(
					new ClassPathResource("mybatis-config.xml")
			);
			return factoryBean.getObject();
		}

		@Bean
		public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
			return new SqlSessionTemplate(sqlSessionFactory);
		}
	}

}