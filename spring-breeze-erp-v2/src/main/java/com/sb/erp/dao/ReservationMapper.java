package com.sb.erp.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.sb.erp.dto.ResvDto;
import com.sb.erp.dto.ResvSearchDto;
import com.sb.erp.dto.StatsResvDto;

@Mapper
public interface ReservationMapper {

	List<ResvDto> selectReservationList(ResvSearchDto search);
    
    int selectReservationCount(ResvSearchDto search);
    
    ResvDto selectReservationDetail(int revId);
    
    void insertReservation(ResvDto ResvDto);

    void updateReservation(ResvDto ResvDto);

    void deleteReservation(int revId);
    
    void updateStatus(ResvDto ResvDto);

    StatsResvDto countByStats(ResvSearchDto search);
    
    int countReservationsByResourceId(int resId);
}
