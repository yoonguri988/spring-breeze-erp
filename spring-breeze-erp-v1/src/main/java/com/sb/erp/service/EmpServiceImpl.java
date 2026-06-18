package com.sb.erp.service;

import java.util.HashMap;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sb.erp.dao.EmpMapper;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.EmpSearchDto;
import com.sb.erp.util.PagingUtil;

@Service
public class EmpServiceImpl implements EmpService {
	@Autowired EmpMapper dao;
	
	@Override
	public List<EmpDto> selectAll() {
		//return dao.selectAll(loginUser.getComId());  // 로그인 사원의 회사
		return dao.selectAll(1);
	}
	
	@Override
	public EmpDto selectByEmpId(int empId) {
		return dao.selectByEmpId(empId, 1);
	}
	
	@Override
	public List<EmpDto> search(EmpSearchDto dto) {
		
		// com_id 임시 주입 → 로그인 유저 정보로 수정
		dto.setComId(1);
				
		return dao.search(dto);
	}
	
	@Override
	public int insert(EmpDto dto) {
		dto.setComId(1);
		dto.setEmpPass(dto.getEmpNo());
		
		if(dto.getEmpStatus() == null || dto.getEmpStatus().isEmpty()) {
			dto.setEmpStatus("재직");
		}
		return dao.insert(dto);
	}
	
	@Override
	public int update(EmpDto dto) {
	    return dao.update(dto);
	}
	
	/* paging */
	@Override
	public int selectCnt(EmpSearchDto dto) {
		
		// com_id 임시 주입 → 로그인 유저 정보로 수정2
		dto.setComId(1);
		
		return dao.selectCnt(dto);
	}

	/*  이메일 중복검사 */
	@Override
	public boolean isEmailDuplicate(String empEmail) {
		return dao.countByEmpEmail(empEmail) > 0;
	}

	
	

	
}