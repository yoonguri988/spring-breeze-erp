package com.sb.erp.service;

import com.sb.erp.dto.DeptTransferExecuteForm;
import com.sb.erp.dto.DeptTransferImpactDto;

public interface DeptTransferService {

	//영향도 조회
	DeptTransferImpactDto getImpact(Integer comId, Integer deptId) throws IllegalAccessException;

	//이관 취소
	int cancelTransfer(Integer comId, Integer deptId) throws IllegalAccessException;

	//이관 최종 실행
	void executeTransfer(DeptTransferExecuteForm form, Integer empId) throws IllegalAccessException;
} 
