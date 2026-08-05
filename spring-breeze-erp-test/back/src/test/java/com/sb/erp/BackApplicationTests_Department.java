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
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.com.dto.request.ComRequest;
import com.sb.erp.com.repository.CompanyMapper;
import com.sb.erp.dept.dto.request.DeptRequest;
import com.sb.erp.dept.dto.response.DeptResponse;
import com.sb.erp.dept.repository.DeptMapper;

@SpringBootTest
@MapperScan({"com.sb.erp.dept.repository", "com.sb.erp.com.repository"})
@Transactional
class BackApplicationTests_Department {

	@Autowired DeptMapper mapper;
	@Autowired CompanyMapper comMapper;
	
	// 여러 테스트에서 공통으로 재사용할 등록된 회사의 PK
	private long savedComId;
	
	private long savedRootDeptId;
	private long savedChildDeptId;
	
	@BeforeEach
	void setUp() {
		// 매 테스트 실행 전, 조회/수정/삭제 테스트에서 사용할 기준 회사 데이터를 등록해둔다.
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
		
		// 기준 부서 트리 등록: root(depth:0) -> child{depth:1)
		DeptRequest root = DeptRequest.builder()
				.comId(savedComId).parentId(0).deptName("베이스부서").deptCode("BASE0").depth(0).sortOrder(1).build();
		savedRootDeptId = insertDeptAndGetId(root);
 
		DeptRequest child = DeptRequest.builder()
				.comId(savedComId).parentId(savedRootDeptId).deptName("베이스하위부서").deptCode("BASE1").depth(1).sortOrder(1).build();
		savedChildDeptId = insertDeptAndGetId(child);
	}
	
	private long insertDeptAndGetId(DeptRequest dto) {
		int res = mapper.insert(dto);
		assertThat(res).isEqualTo(1);
		assertThat(dto.getDeptId()).isGreaterThan(0);
		return dto.getDeptId();
	}

	
	@Test
	@DisplayName("해당 회사가 가지고 있는 부서 갯수 조회")
	void testCountActiveDepts() {
		long count = mapper.countActiveDepts(savedComId);
		assertThat(count).isEqualTo(2);
	}
	
	@Test
	@DisplayName("부서 전체 조회 - 계층 구조 전개")
	void testSelectAll() {
		// 기준 트리(루트+자식) 2개에 루트 아래 형제 부서 2개를 추가
		DeptRequest child1 = DeptRequest.builder()
		                     .comId(savedComId).parentId(savedRootDeptId).deptName("1팀").deptCode("T1").depth(1).sortOrder(2).build();
		DeptRequest child2 = DeptRequest.builder()
						     .comId(savedComId).parentId(savedRootDeptId).deptName("2팀").deptCode("T2").depth(1).sortOrder(3).build();
		insertDeptAndGetId(child1);
		insertDeptAndGetId(child2);
		
		List<DeptResponse> result = mapper.selectAll(savedComId);
		assertThat(result).hasSize(4);
		assertThat(result.get(0).getDeptName()).isEqualTo("베이스부서");
	}
	
	@Test
	@DisplayName("부서 등록 - selectKey로 채번된 deptId가 dto에 채워진다")
	void testInsert() {
		
	}
	
	@Test
	@DisplayName("부서 등록 - 상위부서 없음(parentId=0/null)이면 parent_id는 NULL로 저장된다")
	void testInsert_withoutParent() {
		
	}
	
	@Test
	@DisplayName("id로 부서 단건 조회 - 상위부서/부서장 정보 포함")
	void testSelectOneById() {
		
	}
	
	@Test
	@DisplayName("부서 정렬 순서(sort_order) 최대값 조회")
	void testMaxSortOrder() {
		
	}
	
	@Test
	@DisplayName("하위 부서 존재 여부(countChildren) 확인")
	void testCountChildren() {
		
	}
	
	@Test
	@DisplayName("부서 수정")
	void testUpdate() {
		
	}
	
	@Test
	@DisplayName("부서 삭제(hard delete)")
	void testDelete() {
		
	}
	
	@Test
	@DisplayName("부서 임시 삭제(soft delete) - DEPT_STATUS를 PENDING_DELETE로 변경")
	void testSoftDelete() {
		
	}
	
	@Test
	@DisplayName("부서 통계 조회")
	void testSelectStats() {
		
	}
	
	@Test
	@DisplayName("이관 이력 필터용 - 상태 무관 회사 전체 부서 조회")
	void testSelectAllDeptsByComId() {
		
	}
	
	@Test
	@DisplayName("부서 코드 중복 체크")
	void testSelectDeptCode() {
		
	}
	
	@Test
	@DisplayName("하위 부서 id 목록 조회")
	void testSelectAllChildIds() {
		
	}
	
	@Test
	@DisplayName("부서별 소속 직원 수 카운트 (countByDept)")
	void testCountByDept() {
//		long count = mapper.countByDept(savedChildDeptId);
//		assertThat(count).isEqualTo(1);
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
				    new ClassPathResource("mapper/company-mapper.xml")
			);
			//com.sb.erp.com.dto.request, com.sb.erp.com.dto.response
		    factoryBean.setTypeAliasesPackage("com.sb.erp.dept.dto,com.sb.erp.com.dto"); // 두 패키지 모두
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
