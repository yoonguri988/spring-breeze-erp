package com.sb.erp.service;

import java.util.List;
import java.util.Map;

import com.sb.erp.dto.ReservationDto;

public interface ReservationService {

    List<ReservationDto> getReservationList(Map<String, Object> paramMap);

    int getReservationCount(Map<String, Object> paramMap);

    ReservationDto getReservationDetail(int revId);

    void insertReservation(ReservationDto reservationDto);

   
    void updateStatus(int revId, String status, String remark);

    int countByStatus(Map<String, Object> paramMap);
}