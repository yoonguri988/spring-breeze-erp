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
	public void test9() {
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
