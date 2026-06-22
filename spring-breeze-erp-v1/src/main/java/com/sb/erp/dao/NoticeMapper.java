package com.sb.erp.dao;

import java.util.HashMap;
import java.util.List;

import com.sb.erp.dto.NoticeDto;
import com.sb.erp.dto.NoticeSearchDto;

/* NoticeMapper 인터페이스
 * MyBatis XML과 연결되는 DAO 계층
 */

@Mapper
public interface NoticeMapper {
    
    // 공지 등록
    int insert(NoticeDto dto);
    
    // 공지 수정
    int update(NoticeDto dto);
    
    // 공지 삭제
    int delete(int bno);
    
    // 상세 조회
    NoticeDto select(int bno);
    
    // 조회수 증가
    int updateHit(int bno);
    
    /* 페이징 */
    // XML의 selectPaging와 매칭
    List<NoticeDto> selectAll(NoticeSearchDto search); 
    
    // 전체 카운트
    int selectCount(); 
    
    /* 검색 + 페이징 */
    // XML의 selectNoticeList와 매칭
    List<NoticeDto> selectNoticeList(NoticeSearchDto search);
    
    // 검색 결과 카운트
    long selectCountNoticeList(NoticeSearchDto search);
}
