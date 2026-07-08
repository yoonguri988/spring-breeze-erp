package com.sb.erp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.ReservationMapper;
import com.sb.erp.dto.ResvDto;
import com.sb.erp.dto.ResvSearchDto;
import com.sb.erp.dto.StatsResvDto;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationMapper dao;

    @Override
    public List<ResvDto> getReservationList(ResvSearchDto search) {
        search.setPstartno((search.getPstartno()-1)*search.getOnepagelist());
        List<ResvDto> reservationList = dao.selectReservationList(search);
        return reservationList;
    }

    @Override
    public int getReservationCount(ResvSearchDto search) {
        int totalCount = dao.selectReservationCount(search);
        return totalCount;
    }

    @Override
    public ResvDto getReservationDetail(int revId) {
        ResvDto ResvDto = dao.selectReservationDetail(revId);
        return ResvDto;
    }

    @Override
    public void insertReservation(ResvDto ResvDto) {
    	dao.insertReservation(ResvDto);
    }

    @Override
    public void updateReservation(ResvDto ResvDto) {
        dao.updateReservation(ResvDto);
    }

    @Override
    public void deleteReservation(int revId) {
        dao.deleteReservation(revId);
    }

    @Override
    public void updateStatus(int revId, String status, String remark) {
       
        ResvDto ResvDto = new ResvDto();
        ResvDto.setRevId(revId);
        ResvDto.setStatus(status);
        ResvDto.setRemark(remark);

       
        dao.updateStatus(ResvDto);
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
