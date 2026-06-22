package com.sb.erp.dao;

import java.util.List;
import java.util.Map;

import com.sb.erp.dto.ReservationDto;

@Mapper
public interface ReservationMapper {
    List<ReservationDto> selectReservationList(Map<String, Object> paramMap);
    int selectReservationCount(Map<String, Object> paramMap);
    ReservationDto selectReservationDetail(Map<String, Object> paramMap);
    void insertReservation(ReservationDto reservationDto);
    void updateReservation(ReservationDto reservationDto);
    void deleteReservation(Map<String, Object> paramMap);
    void updateStatus(ReservationDto reservationDto);
    int countByStatus(Map<String, Object> paramMap);
    int countReservationsByResourceId(Map<String, Object> paramMap);
}
