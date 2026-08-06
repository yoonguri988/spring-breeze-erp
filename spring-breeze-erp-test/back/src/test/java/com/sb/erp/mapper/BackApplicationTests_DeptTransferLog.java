package com.sb.erp.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
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
import com.sb.erp.dept.dto.request.DeptTransferLogRequest;
import com.sb.erp.dept.dto.request.DeptTransferLogSearchRequest;
import com.sb.erp.dept.dto.response.DeptTransferLogResponse;
import com.sb.erp.dept.repository.DeptMapper;
import com.sb.erp.dept.repository.DeptTransferLogMapper;
import com.sb.erp.dept.repository.DeptTransferMapper;
import com.sb.erp.emp.dto.request.EmpRequest;
import com.sb.erp.emp.repository.EmpMapper;

@SpringBootTest
@Transactional
class BackApplicationTests_DeptTransferLog {

	@Autowired DeptMapper mapper;
	@Autowired CompanyMapper comMapper;
	@Autowired DeptTransferMapper deptTrasfer;
	@Autowired DeptTransferLogMapper deptTrasferLog;
	@Autowired EmpMapper empMapper;

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

		// 기준 부서 트리 등록: root(depth:0) -> child(depth:1)
		DeptRequest root = DeptRequest.builder()
				.comId(savedComId).parentId(0).deptName("베이스부서").deptCode("BASE0").depth(0).sortOrder(1).build();
		savedRootDeptId = insertDeptAndGetId(root);

		DeptRequest child = DeptRequest.builder()
				.comId(savedComId).parentId(savedRootDeptId).deptName("베이스하위부서").deptCode("BASE1").depth(1).sortOrder(1).build();
		savedChildDeptId = insertDeptAndGetId(child);

		// 이관 로그 조회 시 조인되는 사원 데이터 등록 (이관대상자 / 처리자)
		targetEmpId = insertEmpAndGetId("T" + (System.nanoTime() % 100000), "이관대상", savedRootDeptId);
		createdByEmpId = insertEmpAndGetId("C" + (System.nanoTime() % 100000), "이관처리자", savedRootDeptId);
	}

	private long insertDeptAndGetId(DeptRequest dto) {
		int res = mapper.insert(dto);
		assertThat(res).isEqualTo(1);
		assertThat(dto.getDeptId()).isGreaterThan(0);
		return dto.getDeptId();
	}

	private long insertEmpAndGetId(String empNo, String empName, long deptId) {
		EmpRequest dto = EmpRequest.builder()
				.empNo(empNo)
				.empPass("test1234")
				.empName(empName)
				.deptId(deptId)
				.posId(1L) // 테스트 DB 시드 데이터: pos_id=1 존재 확인됨
				.comId(savedComId)
				.empEmail(empNo.toLowerCase() + "@test.com")
				.empMobile("010-0000-0000")
				.empStatus("재직")
				.hireDate("2024-01-01")
				.build();

		int res = empMapper.insert(dto);
		assertThat(res).isEqualTo(1);
		assertThat(dto.getEmpId()).isGreaterThan(0);
		return dto.getEmpId();
	}

	private void insertLog(long originDeptId, long targetDeptId, long empId, long createdBy,
			String aiRecommended, String aiReason, String handoverSnapshot) {
		DeptTransferLogRequest logDto = new DeptTransferLogRequest();
		logDto.setComId(savedComId);
		logDto.setOriginDeptId(originDeptId);
		logDto.setTargetDeptId(targetDeptId);
		logDto.setEmpId(empId);
		logDto.setCreatedBy(createdBy);
		logDto.setAiRecommended(aiRecommended);
		logDto.setAiReason(aiReason);
		logDto.setHandoverSnapshot(handoverSnapshot);

		int res = deptTrasferLog.insertTransferLog(logDto);
		assertThat(res).isEqualTo(1);
	}

	// 검색 조건 없이 전체 조회할 때 쓰는 기본 search 객체
	// 주의: DeptTransferLogSearchRequest.pstartno 기본값은 1인데, 매퍼는 이 값을 그대로
	// OFFSET 으로 사용하므로(페이지 번호가 아님) 0으로 명시하지 않으면 첫 행이 스킵됩니다.
	private DeptTransferLogSearchRequest defaultSearch() {
		DeptTransferLogSearchRequest search = new DeptTransferLogSearchRequest();
		search.setPstartno(0);
		search.setOnepagelist(10);
		return search;
	}

	@Test
	@DisplayName("부서 이관 로그 삽입 성공")
	void insertTransferLog_성공() {
		insertLog(savedRootDeptId, savedChildDeptId, targetEmpId, createdByEmpId,
				"Y", "AI 추천 사유 테스트", "기존 업무 인수인계 요약");

		int total = deptTrasferLog.listTotal(savedComId, defaultSearch());
		assertThat(total).isEqualTo(1);
	}

	@Test
	@DisplayName("검색조건 없이 전체 이관 로그 조회 시 조인 데이터까지 정상 매핑된다")
	void searchTransferLogs_필터없이_전체조회() {
		insertLog(savedRootDeptId, savedChildDeptId, targetEmpId, createdByEmpId,
				"Y", "AI 추천 사유", "인수인계 요약");

		List<DeptTransferLogResponse> list = deptTrasferLog.searchTransferLogs(savedComId, defaultSearch());

		assertThat(list).hasSize(1);
		DeptTransferLogResponse res = list.get(0);
		assertThat(res.getOriginDeptId()).isEqualTo(savedRootDeptId);
		assertThat(res.getOriginDeptName()).isEqualTo("베이스부서");
		assertThat(res.getTargetDeptId()).isEqualTo(savedChildDeptId);
		assertThat(res.getTargetDeptName()).isEqualTo("베이스하위부서");
		assertThat(res.getEmpId()).isEqualTo(targetEmpId);
		assertThat(res.getEmpName()).isEqualTo("이관대상");
		assertThat(res.getCreatedBy()).isEqualTo(createdByEmpId);
		assertThat(res.getCreatedByName()).isEqualTo("이관처리자");
		assertThat(res.getAiRecommended()).isEqualTo("Y");
	}

	@Test
	@DisplayName("origin/target 부서ID로 필터링하여 조회한다")
	void searchTransferLogs_부서필터() {
		// 필터에 안 걸리는 로그를 만들기 위한 별도 부서
		DeptRequest other = DeptRequest.builder()
				.comId(savedComId).parentId(0).deptName("다른부서").deptCode("OTHER0").depth(0).sortOrder(2).build();
		long otherDeptId = insertDeptAndGetId(other);

		insertLog(savedRootDeptId, savedChildDeptId, targetEmpId, createdByEmpId, "Y", "사유1", "요약1");
		insertLog(otherDeptId, savedChildDeptId, targetEmpId, createdByEmpId, "N", "사유2", "요약2");

		DeptTransferLogSearchRequest search = defaultSearch();
		search.setOriginDeptId(savedRootDeptId);

		List<DeptTransferLogResponse> list = deptTrasferLog.searchTransferLogs(savedComId, search);

		assertThat(list).hasSize(1);
		assertThat(list.get(0).getOriginDeptId()).isEqualTo(savedRootDeptId);
	}

	@Test
	@DisplayName("aiRecommended 값으로 필터링하여 조회한다")
	void searchTransferLogs_AI추천여부_필터() {
		insertLog(savedRootDeptId, savedChildDeptId, targetEmpId, createdByEmpId, "Y", "AI추천", "요약1");
		insertLog(savedRootDeptId, savedChildDeptId, targetEmpId, createdByEmpId, "N", "수동처리", "요약2");

		DeptTransferLogSearchRequest search = defaultSearch();
		search.setAiRecommended("Y");

		List<DeptTransferLogResponse> list = deptTrasferLog.searchTransferLogs(savedComId, search);

		assertThat(list).hasSize(1);
		assertThat(list.get(0).getAiRecommended()).isEqualTo("Y");
	}

	@Test
	@DisplayName("dateFrom ~ dateTo 기간으로 필터링하여 조회한다")
	void searchTransferLogs_기간필터() {
		insertLog(savedRootDeptId, savedChildDeptId, targetEmpId, createdByEmpId, "Y", "사유", "요약");

		LocalDate today = LocalDate.now();

		DeptTransferLogSearchRequest inRange = defaultSearch();
		inRange.setDateFrom(today.toString());
		inRange.setDateTo(today.toString());

		List<DeptTransferLogResponse> list = deptTrasferLog.searchTransferLogs(savedComId, inRange);
		assertThat(list).hasSize(1);

		// 오늘이 포함되지 않은 범위로 조회하면 안 잡혀야 함
		DeptTransferLogSearchRequest outOfRange = defaultSearch();
		outOfRange.setDateFrom(today.minusDays(10).toString());
		outOfRange.setDateTo(today.minusDays(5).toString());

		List<DeptTransferLogResponse> emptyList = deptTrasferLog.searchTransferLogs(savedComId, outOfRange);
		assertThat(emptyList).isEmpty();
	}

	@Test
	@DisplayName("listTotal은 검색조건이 동일할 때 실제 목록 건수와 일치한다")
	void listTotal_카운트일치() {
		insertLog(savedRootDeptId, savedChildDeptId, targetEmpId, createdByEmpId, "Y", "사유1", "요약1");
		insertLog(savedRootDeptId, savedChildDeptId, targetEmpId, createdByEmpId, "N", "사유2", "요약2");
		insertLog(savedRootDeptId, savedChildDeptId, targetEmpId, createdByEmpId, "Y", "사유3", "요약3");

		DeptTransferLogSearchRequest search = defaultSearch();
		search.setAiRecommended("Y");

		List<DeptTransferLogResponse> list = deptTrasferLog.searchTransferLogs(savedComId, search);
		int total = deptTrasferLog.listTotal(savedComId, search);

		assertThat(total).isEqualTo(list.size());
		assertThat(total).isEqualTo(2);
	}

	@Test
	@DisplayName("OFFSET/FETCH 페이징이 정상 동작한다")
	void searchTransferLogs_페이징() {
		// 총 5건 등록 (aiReason 을 서로 다르게 줘서 페이지별로 구분 가능하게 함)
		for (int i = 0; i < 5; i++) {
			insertLog(savedRootDeptId, savedChildDeptId, targetEmpId, createdByEmpId,
					"Y", "사유" + i, "요약" + i);
		}

		DeptTransferLogSearchRequest firstPage = defaultSearch();
		firstPage.setOnepagelist(2);

		List<DeptTransferLogResponse> page1 = deptTrasferLog.searchTransferLogs(savedComId, firstPage);
		assertThat(page1).hasSize(2);

		DeptTransferLogSearchRequest secondPage = defaultSearch();
		secondPage.setPstartno(2);
		secondPage.setOnepagelist(2);

		List<DeptTransferLogResponse> page2 = deptTrasferLog.searchTransferLogs(savedComId, secondPage);
		assertThat(page2).hasSize(2);

		// 페이지끼리 겹치지 않아야 함
		List<String> page1Reasons = page1.stream().map(DeptTransferLogResponse::getAiReason).toList();
		List<String> page2Reasons = page2.stream().map(DeptTransferLogResponse::getAiReason).toList();
		assertThat(page1Reasons).doesNotContainAnyElementsOf(page2Reasons);

		int total = deptTrasferLog.listTotal(savedComId, defaultSearch());
		assertThat(total).isEqualTo(5);
	}

}