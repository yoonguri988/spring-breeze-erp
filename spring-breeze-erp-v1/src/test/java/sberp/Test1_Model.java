package sberp;

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
		EmpSearchDto search;
		search = new EmpSearchDto();
		search.setKeyword("박");
		search.setPosId(8);
		System.out.println("이름에 박+직급8: "+ empMapper.search(search).size() );
		
	}
	
	
	@Ignore //@Test
	public void test6() {
		System.out.println( empMapper.selectByEmpId(1) );
	}
	
	@Ignore //@Test
	public void test5() {
		System.out.println(deptMapper.selectAll());
	}
	
	@Ignore //@Test
	public void test4() {
		System.out.println("...........posMapper.sellectAll()");
		System.out.println(posMapper.selectAll());
	}
	
	@Ignore // @Test
	public void test3() {
		System.out.println("........ empMapper.selectAll()");
		System.out.println(empMapper.selectAll());
	}
	
	@Ignore // @Test
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
