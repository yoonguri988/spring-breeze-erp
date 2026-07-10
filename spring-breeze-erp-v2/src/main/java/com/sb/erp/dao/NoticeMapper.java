package com.sb.erp.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.sb.erp.dto.NoticeDto;
import com.sb.erp.dto.NoticeSearchDto;

@Mapper
public interface NoticeMapper {
    
    // 공지 등록
   public int insert(NoticeDto dto);
    
    // 공지 수정
   public int update(NoticeDto dto);
    
    // 공지 삭제
   public int delete(int bno);
    
    // 상세 조회
   public NoticeDto select(int bno);
    
    // 조회수 증가
   public int updateHit(int bno);
    
    /* 페이징 */
    // XML의 selectPaging와 매칭
   public List<NoticeDto> selectAll(NoticeSearchDto search); 
    
    // 전체 카운트
   public int selectCount(); 
    
    /* 검색 + 페이징 */
    // XML의 selectNoticeList와 매칭
   public List<NoticeDto> selectNoticeList(NoticeSearchDto search);
    
    // 검색 결과 카운트
   public long selectCountNoticeList(NoticeSearchDto search);
}
