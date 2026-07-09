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
}
