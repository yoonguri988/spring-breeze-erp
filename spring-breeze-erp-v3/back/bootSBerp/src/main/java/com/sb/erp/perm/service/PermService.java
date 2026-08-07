package com.sb.erp.perm.service;

import com.sb.erp.perm.dto.AuthPermDto;

public interface PermService {

	AuthPermDto selectByEmpId(int empId);
}
