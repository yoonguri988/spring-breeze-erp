package com.sb.erp.service;

import java.util.HashMap;
import java.util.List;
import com.sb.erp.dto.NoticeDto;

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
	    
	    List<NoticeDto> selectPaging(HashMap<String, Object> map);
	    int selectCount();
	    
	    List<NoticeDto> selectNoticeList(HashMap<String, Object> map);
	    long selectCountNoticeList(HashMap<String, Object> map);
	}
	


