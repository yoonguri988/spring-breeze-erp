package com.sb.erp;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.appr.dto.request.ApprDocRequest;
import com.sb.erp.appr.dto.response.ApprLineResponse;
import com.sb.erp.appr.repository.ApprDocMapper;
import com.sb.erp.appr.repository.ApprLineMapper;

@SpringBootTest
@Transactional
class BackApplicationTests_ApprLine {

	@Autowired
	private ApprLineMapper mapper;

	@Autowired
	private ApprDocMapper docMapper;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	private Long testDocId;
	private Long testEmpId;

	@BeforeEach
	void setUp() {
		// 1) 아무 회사나 하나
		Long comId = jdbcTemplate.queryForObject(
				"select com_id from company where rownum = 1", Long.class);

		// 2) 그 회사 소속 직원 하나
		testEmpId = jdbcTemplate.queryForObject(
				"select emp_id from employee where com_id = ? and rownum = 1",
				Long.class, comId);

		// 3) 그 회사의 활성화된 양식 하나 (최신 버전)
		Long forId = jdbcTemplate.queryForObject(
				"select for_id from appr_form where com_id = ? and for_status = 1 and is_deleted = 0 and rownum = 1",
				Long.class, comId);
		Long forVersion = jdbcTemplate.queryForObject(
				"select max(for_version) from appr_form where for_id = ? and for_status = 1 and is_deleted = 0",
				Long.class, forId);

		// 4) 결재선 테스트 전용 "임시 문서" 생성 (매 테스트마다 새로 만들어서 유니크 제약 걱정 없음)
		ApprDocRequest req = new ApprDocRequest();
		req.setForId(forId);
		req.setForVersion(forVersion);
		req.setDocTitle("결재선 테스트용 문서 " + System.currentTimeMillis());
		req.setDocContent("<p>테스트 내용</p>");
		req.setApproverEmpIds(List.of(testEmpId));

		docMapper.insertDoc(req, testEmpId, comId);
		testDocId = docMapper.selectCurrentDocSeq();

		// 5) 결재선 1번 순서로 등록
		int inserted = mapper.insertLine(testDocId, testEmpId, 1, "WAI");
		assertThat(inserted).isEqualTo(1);
	}

	@Test
	@DisplayName("결재 순서로 조회하면 등록한 라인이 나온다")
	void selectLineByOrder_success() {
		ApprLineResponse line = mapper.selectLineByOrder(testDocId, 1);

		assertThat(line).isNotNull();
		assertThat(line.getDocId()).isEqualTo(testDocId);
		assertThat(line.getEmpId()).isEqualTo(testEmpId);
		assertThat(line.getLinStatus()).isEqualTo("WAI");
	}

	@Test
	@DisplayName("결재 상태를 승인(APP)으로 변경하면 반영된다")
	void updateLineStatus_success() {
		int updated = mapper.updateLineStatus(testDocId, testEmpId, "APP");
		assertThat(updated).isEqualTo(1);

		ApprLineResponse line = mapper.selectLineByOrder(testDocId, 1);
		assertThat(line.getLinStatus()).isEqualTo("APP");
	}

	@Test
	@DisplayName("문서 ID로 전체 결재선을 순서대로 조회한다")
	void selectLinesByDocId_success() {
		List<ApprLineResponse> lines = mapper.selectLinesByDocId(testDocId);

		assertThat(lines).isNotEmpty();
		assertThat(lines.get(0).getDocId()).isEqualTo(testDocId);
	}
}
