package com.sb.erp.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.ReservationMapper;
import com.sb.erp.dto.ReservationDto;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationMapper reservationDao;

    @Override
    public List<ReservationDto> getReservationList(Map<String, Object> paramMap) {
        List<ReservationDto> reservationList = reservationDao.selectReservationList(paramMap);
        return reservationList;
    }

    @Override
    public int getReservationCount(Map<String, Object> paramMap) {
        int totalCount = reservationDao.selectReservationCount(paramMap);
        return totalCount;
    }

    @Override
    public ReservationDto getReservationDetail(int revId) {
        ReservationDto reservationDto = reservationDao.selectReservationDetail(revId);
        return reservationDto;
    }

    @Override
    public void insertReservation(ReservationDto reservationDto) {
        reservationDao.insertReservation(reservationDto);
    }

    @Override
    public void updateStatus(int revId, String status, String remark) {
       
        ReservationDto reservationDto = new ReservationDto();
        reservationDto.setRevId(revId);
        reservationDto.setStatus(status);
        reservationDto.setRemark(remark);

       
        reservationDao.updateStatus(reservationDto);
    }

    @Override
    public int countByStatus(Map<String, Object> paramMap) {
        int count = reservationDao.countByStatus(paramMap);
        return count;
    }
}