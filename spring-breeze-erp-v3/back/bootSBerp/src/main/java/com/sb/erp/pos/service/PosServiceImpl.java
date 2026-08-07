package com.sb.erp.pos.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.pos.dto.request.PosRequest;
import com.sb.erp.pos.dto.response.PosResponse;
import com.sb.erp.pos.repository.PosMapper;
import com.sb.erp.util.dto.SecurityUtil;

@Service
public class PosServiceImpl implements PosService {

	@Autowired PosMapper dao;

	@Override
	public List<PosResponse> selectAll() {
		return dao.selectAll(SecurityUtil.getCurrentComId());
	}

	@Override
	public PosResponse selectOneById(long posId) {
		return dao.selectOneById(posId, SecurityUtil.getCurrentComId());
	}

	@Override
	public int insert(PosRequest dto) {
		dto.setComId(SecurityUtil.getCurrentComId());
		return dao.insert(dto);
	}

	@Override
	public int update(PosRequest dto) {
		dto.setComId(SecurityUtil.getCurrentComId());
		return dao.update(dto);
	}

	@Override
	public int delete(long posId) {
		long comId = SecurityUtil.getCurrentComId();

		int usingCount = dao.countEmpUsing(posId, comId);
		if (usingCount > 0) return -1;

		PosRequest dto = new PosRequest();
		dto.setPosId(posId);
		dto.setComId(comId);
		return dao.delete(dto);
	}

	@Override
	public boolean isPosCodeDuplicate(String posCode, Long excludePosId) {
		return dao.countByPosCode(posCode, SecurityUtil.getCurrentComId(), excludePosId) > 0;
	}
}
