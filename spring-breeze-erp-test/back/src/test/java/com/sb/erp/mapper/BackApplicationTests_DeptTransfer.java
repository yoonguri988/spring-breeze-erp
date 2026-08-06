package com.sb.erp.mapper;

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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.com.dto.request.ComRequest;
import com.sb.erp.com.repository.CompanyMapper;
import com.sb.erp.dept.dto.request.DeptRequest;
import com.sb.erp.dept.dto.response.DeptResponse;
import com.sb.erp.dept.dto.response.PendingDeptResponse;
import com.sb.erp.dept.repository.DeptMapper;
import com.sb.erp.dept.repository.DeptTransferMapper;

@SpringBootTest
@MapperScan({"com.sb.erp.dept.repository", "com.sb.erp.com.repository"})
@Transactional
class BackApplicationTests_DeptTransfer {

	@Autowired DeptMapper mapper;
	@Autowired CompanyMapper comMapper;
	@Autowired DeptTransferMapper deptTrasfer;
	
	@Autowired JdbcTemplate jdbcTemplate;
	
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
	@DisplayName("해당 부서가 자신이 속한 회사의 부서가 맞는지 확인")
	void testCountDeptInCompany() {
		int belongs = deptTrasfer.countDeptInCompany(savedChildDeptId, savedComId);
		assertThat(belongs).isEqualTo(1);
 
		int notBelongs = deptTrasfer.countDeptInCompany(savedChildDeptId, savedComId + 999);
		assertThat(notBelongs).isEqualTo(0);
	}
	
	@Test
	@DisplayName("삭제 대기중인 부서 목록 조회")
	void testSelectOneById() {
		// ACTIVE 상태에서는 조회되지 않아야 함
		assertThat(deptTrasfer.selectOneById(savedChildDeptId)).isNull();
 
		// PENDING_DELETE 상태로 변경 후에는 조회되어야 함
		mapper.softDelete(savedChildDeptId);
		DeptResponse result = deptTrasfer.selectOneById(savedChildDeptId);
		
		assertThat(result).isNotNull();
		assertThat(result.getDeptId()).isEqualTo(savedChildDeptId);
	}
	
	@Test
	@DisplayName("이관 대상 사원")
	void testFindEmployeesByDept() {
		// TODO: employee / emp_position 등록용 Mapper 가 추가되면 구현
		// TODO: 참고 - 현재 XML resultType 이 EmpTransferResponse 가 아닌 ResvImpactResponse 로
		//       잘못 지정되어 있어 그대로 두면 캐스팅 오류가 발생함. XML 수정도 함께 필요.
	}
	
	@Test
	@DisplayName("사원 기준 미처리 예약")
	void testFindPendingResvByDept() {
		// TODO: employee / com_resource / reservation 등록용 Mapper 가 추가되면 구현
	}
 
	@Test
	@DisplayName("사원 기준 미완료 결재라인")
	void testFindPendingApprLineByDept() {
		// TODO: employee / appr_form / appr_doc / appr_line 등록용 Mapper 가 추가되면 구현
	}
 
	@Test
	@DisplayName("사원이 기안한 진행중 결재문서")
	void testFindPendingApprDocsByDept() {
		// TODO: employee / appr_form / appr_doc 등록용 Mapper 가 추가되면 구현
	}
 
	@Test
	@DisplayName("사원이 기안한 진행중 결재문서 제목 요약 — AI 프롬프트 재료 겸 dept_transfer_log.handover_snapshot 원본")
	void testFindPendingApprDocTitles() {
		// TODO: employee / appr_form / appr_doc 등록용 Mapper 가 추가되면 구현
	}
 
	@Test
	@DisplayName("필터링: (1) 동일 상위조직(형제 부서) OR (2) 해체 대상 부서의 상위 부서 자체")
	void testFindCandidateDepartments() {
		// child 의 형제 부서 추가
		DeptRequest sibling = DeptRequest.builder()
				.comId(savedComId).parentId(savedRootDeptId).deptName("형제부서").deptCode("BASE2").depth(1).sortOrder(2).build();
		long siblingId = insertDeptAndGetId(sibling);
 
		// child 와 무관한 부서 (후보에 포함되면 안 됨)
		DeptRequest unrelated = DeptRequest.builder()
				.comId(savedComId).parentId(0).deptName("무관부서").deptCode("BASE3").depth(0).sortOrder(2).build();
		insertDeptAndGetId(unrelated);
 
		List<DeptResponse> result = deptTrasfer.findCandidateDepartments(savedChildDeptId, savedComId);
 
		List<Long> ids = result.stream().map(DeptResponse::getDeptId).toList();
		assertThat(ids).contains(siblingId, savedRootDeptId);
		assertThat(ids).doesNotContain(savedChildDeptId);
	}
	
	@Test
	@DisplayName("필터링: 필터링 실패 시 폴백용 전체 목록")
	void testFindActiveDeptsExcluding() {
		List<DeptResponse> result = deptTrasfer.findActiveDeptsExcluding(savedChildDeptId, savedComId);
 
		List<Long> ids = result.stream().map(DeptResponse::getDeptId).toList();
		assertThat(ids).contains(savedRootDeptId);
		assertThat(ids).doesNotContain(savedChildDeptId);
	}
	
	@Test
	@DisplayName("이관 취소 업데이트")
	void testUpdateActiveById() {
		mapper.softDelete(savedChildDeptId);
 
		int updated = deptTrasfer.updateActiveById(savedChildDeptId);
 
		assertThat(updated).isEqualTo(1);
		String status = jdbcTemplate.queryForObject(
				"SELECT dept_status FROM department WHERE dept_id = ?", String.class, savedChildDeptId);
		assertThat(status).isEqualTo("ACTIVE");
	}
	
	@Test
	@DisplayName("부서 이관 확정")
	void testMarkDeleted() {
		int updated = deptTrasfer.markDeleted(savedChildDeptId);
 
		assertThat(updated).isEqualTo(1);
		String status = jdbcTemplate.queryForObject(
				"SELECT dept_status FROM department WHERE dept_id = ?", String.class, savedChildDeptId);
		assertThat(status).isEqualTo("DELETED");
	}
 
	@Test
	@DisplayName("부서 이관 진행 (사원 부서 업데이트)")
	void testUpdateEmployeeDept() {
		// TODO: employee 등록용 Mapper 가 추가되면 구현
	}
	
	@Test
	@DisplayName("이관 대기(PENDING_DELETE) 부서 목록")
	void testFindPendingTransferDepts() {
		mapper.softDelete(savedChildDeptId);
 
		// keyword 없이 전체 조회
		List<PendingDeptResponse> all = deptTrasfer.findPendingTransferDepts(savedComId, null);
		assertThat(all).hasSize(1);
		assertThat(all.get(0).getDeptId()).isEqualTo(savedChildDeptId);
 
		// keyword 매칭
		List<PendingDeptResponse> matched = deptTrasfer.findPendingTransferDepts(savedComId, "하위부서");
		assertThat(matched).hasSize(1);
 
		// keyword 불일치
		List<PendingDeptResponse> unmatched = deptTrasfer.findPendingTransferDepts(savedComId, "존재하지않음");
		assertThat(unmatched).isEmpty();
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
				    new ClassPathResource("mapper/depttransfer-mapper.xml"),
				    new ClassPathResource("mapper/company-mapper.xml")
			);
			//com.sb.erp.com.dto.request, com.sb.erp.com.dto.response
		    factoryBean.setTypeAliasesPackage("com.sb.erp.dept.dto,com.sb.erp.com.dto,com.sb.erp.appr.dto,com.sb.erp.emp.dto,com.sb.erp.resv.dto"); // 두 패키지 모두
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
