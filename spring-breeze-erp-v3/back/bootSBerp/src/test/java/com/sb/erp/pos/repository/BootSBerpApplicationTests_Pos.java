package com.sb.erp.pos.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;

import com.sb.erp.pos.dto.request.PosRequest;
import com.sb.erp.pos.dto.response.PosResponse;
import com.sb.erp.pos.repository.PosMapper;


@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@org.mybatis.spring.annotation.MapperScan("com.sb.erp.pos.repository")
@org.springframework.test.context.TestPropertySource(
    properties = "mybatis.mapper-locations=classpath:mapper/pos/*.xml"
)
class PosMapperTest {

	@Autowired
	private PosMapper posMapper;

	private static final long TEST_COM_ID = 1L;

	@Test
	@DisplayName("selectAll: 회사별 직급 목록을 pos_order 순으로")
	void selectAll() {
		List<PosResponse> list = posMapper.selectAll(TEST_COM_ID);

		assertThat(list).isNotNull();
		if (list.size() >= 2) {
			assertThat(list.get(0).getPosOrder())
				.isLessThanOrEqualTo(list.get(1).getPosOrder());
		}
	}

	@Test
	@DisplayName("insert: 직급 등록 후 selectKey로 posId")
	void insert() {
		PosRequest req = new PosRequest();
		req.setPosCode("TEST99");
		req.setPosName("테스트직급");
		req.setPosOrder(99);
		req.setComId(TEST_COM_ID);

		int result = posMapper.insert(req);

		assertThat(result).isEqualTo(1);
		assertThat(req.getPosId()).isGreaterThan(0);
	}

	@Test
	@DisplayName("selectOneById: 등록한 직급을 다시 조회")
	void selectOneById() {
		PosRequest req = new PosRequest();
		req.setPosCode("TEST98");
		req.setPosName("조회테스트");
		req.setPosOrder(98);
		req.setComId(TEST_COM_ID);
		posMapper.insert(req);

		PosResponse found = posMapper.selectOneById(req.getPosId(), TEST_COM_ID);

		assertThat(found).isNotNull();
		assertThat(found.getPosCode()).isEqualTo("TEST98");
		assertThat(found.getPosName()).isEqualTo("조회테스트");
	}

	@Test
	@DisplayName("update: 직급 정보를 수정할 수 있다")
	void update() {
		PosRequest req = new PosRequest();
		req.setPosCode("TEST97");
		req.setPosName("원본이름");
		req.setPosOrder(97);
		req.setComId(TEST_COM_ID);
		posMapper.insert(req);

		req.setPosName("수정된이름");
		int result = posMapper.update(req);

		assertThat(result).isEqualTo(1);
		PosResponse found = posMapper.selectOneById(req.getPosId(), TEST_COM_ID);
		assertThat(found.getPosName()).isEqualTo("수정된이름");
	}

	@Test
	@DisplayName("countByPosCode: 등록된 직급 코드는 중복으로 카운트")
	void countByPosCode() {
		PosRequest req = new PosRequest();
		req.setPosCode("DUP01");
		req.setPosName("중복테스트");
		req.setPosOrder(96);
		req.setComId(TEST_COM_ID);
		posMapper.insert(req);

		int count = posMapper.countByPosCode("DUP01", TEST_COM_ID, null);

		assertThat(count).isGreaterThanOrEqualTo(1);
	}

	@Test
	@DisplayName("countByPosCode: excludePosId를 넘기기/자신 제외")
	void countByPosCode_excludeSelf() {
		PosRequest req = new PosRequest();
		req.setPosCode("DUP02");
		req.setPosName("자기제외");
		req.setPosOrder(95);
		req.setComId(TEST_COM_ID);
		posMapper.insert(req);

		int count = posMapper.countByPosCode("DUP02", TEST_COM_ID, req.getPosId());

		assertThat(count).isEqualTo(0);
	}

	@Test
	@DisplayName("delete: 직급 삭제")
	void delete() {
		PosRequest req = new PosRequest();
		req.setPosCode("DEL01");
		req.setPosName("삭제테스트");
		req.setPosOrder(94);
		req.setComId(TEST_COM_ID);
		posMapper.insert(req);

		int result = posMapper.delete(req);

		assertThat(result).isEqualTo(1);
		PosResponse found = posMapper.selectOneById(req.getPosId(), TEST_COM_ID);
		assertThat(found).isNull();
	}
}
