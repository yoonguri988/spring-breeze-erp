package ex02;

import java.net.InetAddress;
import java.net.UnknownHostException;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSession;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.the703.dao.BoardMapper;
import com.the703.dao.TestMapper;
import com.the703.dto.BoardDto;
import com.the703.service.BoardService;
@Service
@RunWith(SpringJUnit4ClassRunner.class)  //1. spring 구동테스트
@ContextConfiguration(locations = "classpath:config/root-context.xml")  //2. 설정
public class ModelTest { 
	@Autowired  ApplicationContext context;  //3. Bean ( 스프링이 관리하는 객체) 생성~소멸
	@Autowired  DataSource  dataSource;
	@Autowired  SqlSession  sqlSession; 
	@Autowired  TestMapper  testMapper;  
	
	@Autowired  BoardMapper  boardMapper;  
	@Autowired  BoardService service;
	   @Test
	   public void test5() {
	      //삭제
	      BoardDto dto = new BoardDto();   dto.setBno(4);
	      System.out.println(  service.delete(dto) );
	      //수정
	      //      BoardDto dto = new BoardDto();
	      //      dto.setBname("first");        dto.setBpass("1111"); dto.setBno(4);
	      //      dto.setBtitle("NEW-service-첫번째 글쓰기");  dto.setBcontent("NEW-service-내용");
	      //      System.out.println(  service.edit(dto) ); 
	      
	      //검색
	      System.out.println(service.detail(4)); 
	      //삽입  -  4
	            BoardDto dto1 = new BoardDto();
	            dto1.setBname("first");        dto1.setBpass("1111");
	            dto1.setBtitle("service-첫번째 글쓰기");  dto1.setBcontent("service-내용");
	            System.out.println(  service.insert(dto1) );
	      
	      //전체리스트
	      System.out.println(service.selectAll());
 }
}  