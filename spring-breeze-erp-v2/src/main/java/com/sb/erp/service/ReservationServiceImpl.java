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
    public List<ResvDto> getResvList(ResvSearchDto search) {
        search.setPstartno((search.getPstartno()-1)*search.getOnepagelist());
        List<ResvDto> list = dao.selectAll(search);
        return list;
    }

    @Override
    public int getResvCount(ResvSearchDto search) {
        return dao.selectCount(search);
    }

    @Override
    public ResvDto getResvDetail(int revId) {
        return dao.selectOneById(revId);
    }

    @Override
    public int insert(ResvDto ResvDto) {
    	return dao.insert(ResvDto);
    }

    @Override
    public int update(ResvDto ResvDto) {
    	return dao.update(ResvDto);
    }

    @Override
    public int delete(int revId) {
    	return dao.delete(revId);
    }

    @Override
    public StatsResvDto countByStats(ResvSearchDto search) {
        return dao.countByStats(search);
    }
    
    @Override
    public int countReservationsByResourceId(int resId) {
        return dao.countReservationsByResourceId(resId);
    }

	@Override
	public int updateApprove(ResvDto resvDto) {
		return dao.updateApprove(resvDto);
	}

	@Override
	public int updateReject(ResvDto resvDto) {
		return dao.updateReject(resvDto);
	}
}
