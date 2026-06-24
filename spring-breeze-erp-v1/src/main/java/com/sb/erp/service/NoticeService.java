package com.sb.erp.service;

import java.util.List;
import com.sb.erp.dto.NoticeDto;
import com.sb.erp.dto.NoticeSearchDto;

/* Service 계층 인터페이스
 * 비즈니스 로직 정의
 * Service → Mapper → XML로 DB CRUD 수행
 */

public interface NoticeService {
	
		int insert(NoticeDto dto);
	    int update(NoticeDto dto);
	    int delete(int bno);
	    NoticeDto select(int bno);
	    int updateHit(int bno);
	    
	    List<NoticeDto> selectAll(NoticeSearchDto search);
	    int selectCount();
	    
	    List<NoticeDto> selectNoticeList(NoticeSearchDto search);
	    long selectCountNoticeList(NoticeSearchDto search);
	}
	


