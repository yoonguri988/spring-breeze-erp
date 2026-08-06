package com.sb.erp.service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class BackApplicationTests_Company {
	//@Autowired CompanyService service;
	
	// 여러 테스트에서 공통으로 재사용할 등록된 회사의 PK
	private long savedComId1;
	private long savedComId2;
	
	@Test
	void contextLoads() {
	}

}
