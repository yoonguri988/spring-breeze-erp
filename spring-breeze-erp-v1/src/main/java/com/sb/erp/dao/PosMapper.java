package com.sb.erp.dao;

import java.util.List;
import com.sb.erp.dto.PosDto;

@Mapper
public interface PosMapper {

	//필요한 메서드 선언
	//직급 가져오기
	public List<PosDto> selectAll();
	
}
