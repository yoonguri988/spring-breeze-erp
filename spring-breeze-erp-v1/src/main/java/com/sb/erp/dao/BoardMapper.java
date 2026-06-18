package com.sb.erp.dao;

import java.util.HashMap;
import java.util.List;
import com.sb.erp.dto.BoardDto;

@Mapper
public interface BoardMapper {
	public  int  insert(BoardDto dto);
	public  int  update(BoardDto dto);
	public  int  delete(int bno);
	
	public  List<BoardDto>  selectAll();
	public        BoardDto  select(int bno);
	public  int  updateHit(int bno);
	
	
	/*	 paging		*/
	/*	 paging		*/
	public   List<BoardDto>   select10(HashMap<String,Integer> map); 
	public   int              selectCnt(); 

}

/* select * from sb_erp_db.notice;
| ★7.  전사 공지 관리 | 사용자 | 관리자 |
| CREATE 			| X   | 공지 등록  |
  		insert into notice (com_id, btitle, bcontent, emp_id, bhit, bfile)
  		VALUES (1, 'ERP 시스템 점검 안내', '6월 20일 22시~24시 ERP 시스템 점검 예정입니다.', 1, 12, NULL),
				(1, '인사관리 규정 개정', '직급/재직 상태 관련 규정이 개정되었습니다.', 2, 34, 'insa_rule.pdf');
			
| READ | 전체 공지(페이징) ,  공지 상세보기, 검색 |  |
 	select * from sb_erp_db.notice  order by bno desc
 	select * from sb_erp_db.notice  where  bno= #{bno}
 	
| UPDATE           | X 	  | 공지 수정 |
	update  sb_erp_db.notice  set  btitle=#{btitle}  , bcontent=#{bcontent}  where bno= #{bno}

| DELETE 			| X 	| 공지 삭제 |
 	delete  from   sb_erp_db.notice  where bno= #{bno} 
=============================================================================
(해당번호의 글읽기, 글수정, 삭제)
create : insert into  mvcboard2 (bname , bpass , btitle , bcontent , bip)  
         values  (   #{bname} , #{bpass} , #{btitle} , #{bcontent} , #{bip} )
read   : select * from mvcobard2  order by bno desc
         select * from mvcobard2  where  bno= #{bno}
update : update  mvcboard2  set  btitle=#{btitle}  , bcontent=#{bcontent}  where bno= #{bno}
delete : delete  from mvcboard2  where bno= #{bno} 
*/