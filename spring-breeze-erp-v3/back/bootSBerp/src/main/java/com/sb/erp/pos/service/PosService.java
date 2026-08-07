package com.sb.erp.pos.service;

import java.util.List;

import com.sb.erp.pos.dto.request.PosRequest;
import com.sb.erp.pos.dto.response.PosResponse;

public interface PosService {

	List<PosResponse> selectAll();

	PosResponse selectOneById(long posId);

	int insert(PosRequest dto);

	int update(PosRequest dto);

	int delete(long posId);

	boolean isPosCodeDuplicate(String posCode, Long excludePosId);
}
