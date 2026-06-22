package com.sb.erp.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sb.erp.dao.NoticeMapper;
import com.sb.erp.dto.NoticeDto;
import com.sb.erp.dto.NoticeSearchDto;

/* Service 구현체
 * Mapper 호출하여 실제 DB 작업 수행
 */

@Service
public class NoticeServiceImpl implements NoticeService{
	
	    @Autowired	    NoticeMapper noticeMapper;

	    @Override // 공지등록
	    public int insert(NoticeDto dto) { 
	        return noticeMapper.insert(dto);
	    }

	    @Override // 공지수정
	    public int update(NoticeDto dto) {
	        return noticeMapper.update(dto);
	    }

	    @Override // 공지삭제
	    public int delete(int bno) {
	        return noticeMapper.delete(bno);
	    }

	    @Override // 공지 상세 조회
	    public NoticeDto select(int bno) {
	        return noticeMapper.select(bno);
	    }

	    @Override // 공지 조회수 증가
	    public int updateHit(int bno) {
	        return noticeMapper.updateHit(bno);
	    }

	    @Override  // 페이징
	    public List<NoticeDto> selectAll(NoticeSearchDto search) {
	    	search.setPstartno((search.getPstartno()-1)*search.getOnepagelist());
	        return noticeMapper.selectAll(search);
	    }

	    @Override // 전체 카운트
	    public int selectCount() {
	        return noticeMapper.selectCount();
	    }

	    @Override // 검색+페이징
	    public List<NoticeDto> selectNoticeList(NoticeSearchDto search) {
	        return noticeMapper.selectNoticeList(search);
	    }

	    @Override // 검색 결과 카운트
	    public long selectCountNoticeList(NoticeSearchDto search) {
	        return noticeMapper.selectCountNoticeList(search);
	    }
}
