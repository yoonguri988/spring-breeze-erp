package com.sb.erp.service;

import java.util.HashMap;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.sb.erp.dao.EmpMapper;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.EmpSearchDto;
import com.sb.erp.util.PagingUtil;

@Service
public class EmpServiceImpl implements EmpService {
	@Autowired EmpMapper dao;
	@Autowired BCryptPasswordEncoder passEncoder;
	
	// 사원 목록 조회
	@Override
	public List<EmpDto> selectAll() {
		//return dao.selectAll(loginUser.getComId());  // 로그인 사원의 회사
		return dao.selectAll(1);
	}
	
	// empId로 사원 정보 찾기
	@Override
	public EmpDto selectByEmpId(int empId) {
		return dao.selectByEmpId(empId, 1);
	}
	
	// 사원 정보 검색
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
	
	/*  모바일 중복검사 */
	@Override
	public boolean isMobileDuplicate(String empMobile) {
		return dao.countByEmpMobile(empMobile) > 0;
	}
	
	/* 사번 중복검사 */
	@Override
	public boolean isEmpNoDuplicate(String empNo) {
		return dao.countByEmpNo(empNo, 1) > 0;
	}


	@Override
	public EmpDto selectForVerify(EmpDto dto) {
		return dao.selectForVerify(dto);
	}
	@Override
	public int updatePassByEmpId(EmpDto dto) {
		return dao.updatePassByEmpId(dto);
	}
	@Override
	public EmpDto selectByEmpEmail(String empEmail) {
		return dao.selectByEmpEmail(empEmail);
	}

	@Override
	public boolean matchPassword(EmpDto dto) {
		String existsPass = dao.selectPassById(dto.getEmpId());
		return passEncoder.matches(dto.getEmpPass(), existsPass);
	}
	@Override
	public List<EmpDto> selectByDeptId(int deptId) {
		return dao.selectByDeptId(deptId);
	}
	
}