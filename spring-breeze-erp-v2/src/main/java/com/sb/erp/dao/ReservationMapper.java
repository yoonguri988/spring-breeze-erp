package com.sb.erp.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.sb.erp.dto.ResvDto;
import com.sb.erp.dto.ResvSearchDto;
import com.sb.erp.dto.StatsResvDto;

@Mapper
public interface ReservationMapper {

	List<ResvDto> selectAll(ResvSearchDto search);
    
    int selectCount(ResvSearchDto search);
    
    ResvDto selectOneById(int revId);
    
    int insert(ResvDto ResvDto);

    int update(ResvDto ResvDto);

    int delete(int revId);
    
    StatsResvDto countByStats(ResvSearchDto search);
    
    int countReservationsByResourceId(int resId);

	int updateApprove(ResvDto resvDto);
	int updateReject(ResvDto ResvDto);

	// 같은 기간에 이미 예약된 수량 합계 조회
	int selectReservedQuantity(ResvSearchDto dto);
}
