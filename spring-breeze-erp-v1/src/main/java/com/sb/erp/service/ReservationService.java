package com.sb.erp.service;

import java.util.List;
import java.util.Map;

import com.sb.erp.dto.ReservationDto;

public interface ReservationService {

    // 예약 목록 조회 (검색 조건 + 페이징 포함)
    List<ReservationDto> getReservationList(Map<String, Object> paramMap);

    // 예약 전체 건수 조회 (페이징 계산용)
    int getReservationCount(Map<String, Object> paramMap);

    // 예약 상세 1건 조회 (회사ID + 예약ID로 특정)
    ReservationDto getReservationDetail(int comId, int revId);

    // 예약 신청 등록
    void insertReservation(ReservationDto reservationDto);

    // 예약 정보 수정
    void updateReservation(ReservationDto reservationDto);

    // 예약 삭제 (회사ID + 예약ID로 특정)
    void deleteReservation(int comId, int revId);

    // 예약 상태 변경 (WAI → APP 승인 / WAI → REJ 반려)
    // remark: 반려 시 사유 입력, 승인 시 null
    void updateStatus(int revId, String status, String remark);

    // 특정 상태(WAI / APP / REJ)의 예약 건수 조회
    // 관리자 대시보드 통계 카드에 사용
    int countByStatus(Map<String, Object> paramMap);

    // 특정 자원에 연결된 예약 건수 조회
    // 자원 삭제 전 예약 존재 여부 확인할 때 사용
    int countReservationsByResourceId(int comId, int resId);
}