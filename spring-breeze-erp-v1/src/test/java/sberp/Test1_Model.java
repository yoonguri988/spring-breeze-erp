package sberp;

import java.util.List;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSession;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.sb.erp.dao.DeptMapper;
import com.sb.erp.dao.EmpMapper;
import com.sb.erp.dao.PosMapper;
import com.sb.erp.dao.TestMapper;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.EmpSearchDto;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations= {
		"classpath:config/root-context.xml"
		,"classpath:config/security-context.xml"
})
public class Test1_Model {
	@Autowired ApplicationContext context;
	@Autowired DataSource ds;
	@Autowired SqlSession sqlSession;
	@Autowired TestMapper testMapper;
	@Autowired EmpMapper empMapper;
	@Autowired PosMapper posMapper;
	@Autowired DeptMapper deptMapper;
	
	
	@Test
	public void test7() {
	    // 존재하는 사번
	    int cnt1 = empMapper.countByEmpNo("EMP001", 1);
	    System.out.println("EMP001 in com 1: " + cnt1);  // 1
	    
	    // 같은 사번, 다른 회사 — UNIQUE 정책상 0이어야 함
	    int cnt2 = empMapper.countByEmpNo("EMP001", 2);
	    System.out.println("EMP001 in com 2: " + cnt2);  // 0
	    
	    // 없는 사번
	    int cnt3 = empMapper.countByEmpNo("EMP999", 1);
	    System.out.println("EMP999 in com 1: " + cnt3);  // 0
	}
	
	@Ignore //@Test
	public void test6() {
	    // 존재하는 이메일
	    int cnt1 = empMapper.countByEmpEmail("admin@smartbuilder.com");
	    System.out.println("admin 이메일 개수: " + cnt1);  // 1
	    
	    // 존재하지 않는 이메일
	    int cnt2 = empMapper.countByEmpEmail("nobody@nowhere.com");
	    System.out.println("없는 이메일 개수: " + cnt2);  // 0
	}
	
	@Ignore //@Test
	public void test5() {
	    EmpSearchDto dto = new EmpSearchDto();
	    dto.setComId(1);
	    dto.setPstartno(0);       // 1페이지 (OFFSET 0)
	    dto.setOnepagelist(10);
	    
	    List<EmpDto> page1 = empMapper.search(dto);
	    System.out.println("1페이지 개수: " + page1.size());
	    
	    dto.setPstartno(10);      // 2페이지 (OFFSET 10)
	    List<EmpDto> page2 = empMapper.search(dto);
	    System.out.println("2페이지 개수: " + page2.size());
	    
	    System.out.println("전체 개수: " + empMapper.selectCnt(dto));
	}

	
	@Ignore //@Test
	public void test4() {
		System.out.println("...........posMapper.sellectAll()");
		System.out.println(posMapper.selectAll(1));
	}
	
	@Ignore // @Test
	public void test3() {
		System.out.println("........ empMapper.selectAll()");
		System.out.println(empMapper.selectAll(1));
	}
	
	@Ignore @Test
	public void test2() {
		System.out.println(".........testMapper.now(): "+testMapper.now());
	}
	
	@Ignore //@Test
	public void test1() {
		System.out.println(".........3. "+ sqlSession);
		System.out.println(".........2. "+ ds);
		System.out.println(".........1. "+ context);
	}

}
