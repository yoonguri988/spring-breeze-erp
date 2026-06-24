package com.sb.erp.service;

import java.util.List;

import com.sb.erp.dto.ReservationDto;
import com.sb.erp.dto.ResvSearchDto;
import com.sb.erp.dto.StatsResvDto;

public interface ReservationService {

    List<ReservationDto> getReservationList(ResvSearchDto search);

    int getReservationCount(ResvSearchDto search);

    ReservationDto getReservationDetail(int revId);

    void insertReservation(ReservationDto reservationDto);

    void updateStatus(int revId, String status, String remark);

    // 통계 (전체/승인/대기/반려)
    StatsResvDto countByStats(ResvSearchDto search);

    // 예약 관리에서 예약 된 자원이 있는지 확인
    int countReservationsByResourceId(int resId);
}