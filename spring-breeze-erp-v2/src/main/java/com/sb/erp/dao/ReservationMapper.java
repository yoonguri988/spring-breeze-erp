package com.sb.erp.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.sb.erp.dto.ReservationDto;
import com.sb.erp.dto.ResvSearchDto;
import com.sb.erp.dto.StatsResvDto;

@Mapper
public interface ReservationMapper {

	List<ReservationDto> selectReservationList(ResvSearchDto search);
    
    int selectReservationCount(ResvSearchDto search);
    
    ReservationDto selectReservationDetail(int revId);
    
    void insertReservation(ReservationDto reservationDto);

    void updateReservation(ReservationDto reservationDto);

    void deleteReservation(int revId);
    
    void updateStatus(ReservationDto reservationDto);

    StatsResvDto countByStats(ResvSearchDto search);
    
    int countReservationsByResourceId(int resId);
}
