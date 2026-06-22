package com.sb.erp.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.ReservationMapper;
import com.sb.erp.dto.ReservationDto;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationMapper reservationDao; // MyBatis Mapper 주입

    // 예약 목록 조회 - 검색 조건(status, keyword 등)과 페이징을 Map으로 전달
    @Override
    public List<ReservationDto> getReservationList(Map<String, Object> paramMap) {
        return reservationDao.selectReservationList(paramMap);
    }

    // 예약 전체 건수 조회 - 같은 검색 조건으로 총 건수 확인 (PagingUtil 계산에 사용)
    @Override
    public int getReservationCount(Map<String, Object> paramMap) {
        return reservationDao.selectReservationCount(paramMap);
    }

    // 예약 상세 조회 - comId + revId를 Map에 담아 Mapper로 전달
    @Override
    public ReservationDto getReservationDetail(int comId, int revId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", comId);
        paramMap.put("revId", revId);
        return reservationDao.selectReservationDetail(paramMap);
    }

    // 예약 신청 등록 - ReservationDto를 그대로 Mapper에 전달
    @Override
    public void insertReservation(ReservationDto reservationDto) {
        reservationDao.insertReservation(reservationDto);
    }

    // 예약 정보 수정 - ReservationDto를 그대로 Mapper에 전달
    @Override
    public void updateReservation(ReservationDto reservationDto) {
        reservationDao.updateReservation(reservationDto);
    }

    // 예약 삭제 - comId + revId를 Map에 담아 전달
    @Override
    public void deleteReservation(int comId, int revId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", comId);
        paramMap.put("revId", revId);
        reservationDao.deleteReservation(paramMap);
    }

    // 예약 상태 변경 (승인 / 반려)
    // - 승인: status="APP", remark=null
    // - 반려: status="REJ", remark="반려 사유 내용"
    // ReservationDto에 값을 세팅한 뒤 Mapper로 전달
    @Override
    public void updateStatus(int revId, String status, String remark) {
        ReservationDto reservationDto = new ReservationDto();
        reservationDto.setRevId(revId);
        reservationDto.setStatus(status);
        reservationDto.setRemark(remark); // 반려 시 사유 저장, 승인 시 null
        reservationDao.updateStatus(reservationDto);
    }

    // 상태별 예약 건수 조회 - 관리자 대시보드 통계 카드(대기/승인/반려 각각 몇 건)에 사용
    @Override
    public int countByStatus(Map<String, Object> paramMap) {
        return reservationDao.countByStatus(paramMap);
    }

    // 특정 자원에 연결된 예약 건수 조회
    // 자원 삭제 시 예약이 남아 있으면 삭제 불가 처리할 때 사전 확인용으로 사용
    @Override
    public int countReservationsByResourceId(int comId, int resId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", comId);
        paramMap.put("resId", resId);
        return reservationDao.countReservationsByResourceId(paramMap);
    }
}