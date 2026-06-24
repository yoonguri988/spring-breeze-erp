package com.sb.erp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.ReservationMapper;
import com.sb.erp.dto.ReservationDto;
import com.sb.erp.dto.ResvSearchDto;
import com.sb.erp.dto.StatsResvDto;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationMapper dao;

    @Override
    public List<ReservationDto> getReservationList(ResvSearchDto search) {
        List<ReservationDto> reservationList = dao.selectReservationList(search);
        return reservationList;
    }

    @Override
    public int getReservationCount(ResvSearchDto search) {
    	search.setPstartno((search.getPstartno()-1)*search.getOnepagelist());
        int totalCount = dao.selectReservationCount(search);
        return totalCount;
    }

    @Override
    public ReservationDto getReservationDetail(int revId) {
        ReservationDto reservationDto = dao.selectReservationDetail(revId);
        return reservationDto;
    }

    @Override
    public void insertReservation(ReservationDto reservationDto) {
    	dao.insertReservation(reservationDto);
    }

    @Override
    public void updateStatus(int revId, String status, String remark) {
       
        ReservationDto reservationDto = new ReservationDto();
        reservationDto.setRevId(revId);
        reservationDto.setStatus(status);
        reservationDto.setRemark(remark);

       
        dao.updateStatus(reservationDto);
    }

    @Override
    public StatsResvDto countByStats(ResvSearchDto search) {
        return dao.countByStats(search);
    }
    
    @Override
    public int countReservationsByResourceId(int resId) {
        return dao.countReservationsByResourceId(resId);
    }
}