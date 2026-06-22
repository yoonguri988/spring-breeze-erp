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
import com.sb.erp.dao.NoticeMapper;
import com.sb.erp.dao.PosMapper;
import com.sb.erp.dao.TestMapper;
import com.sb.erp.dto.EmpSearchDto;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations= {
		"classpath:config/root-context.xml"
		,"classpath:config/security-context.xml"
})
public class Test2_Model {
	@Autowired ApplicationContext context;
	@Autowired DataSource ds;
	@Autowired SqlSession sqlSession;
	//@Autowired DeptMapper deptMapper;
	//@Autowired NoticeMapper noticeMapper;
	
	@Ignore// @Test
	public void test3() {
		System.out.println("........ noticeMapper.selectAll()");
		//System.out.println(noticeMapper.select(1));
	}
	
	@Ignore //@Test
	public void test2() {
		//System.out.println(".........testMapper.now(): "+ testMapper.now());
	}
	
	@Test
	public void test1() {
		System.out.println(".........3. "+ sqlSession);
		System.out.println(".........2. "+ ds);
		System.out.println(".........1. "+ context);
	}

}
