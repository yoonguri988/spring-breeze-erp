package com.sb.erp.service;

import com.sb.erp.dto.PermDto;

public interface PermService {

	PermDto selectByEmpId(int empId);
}
