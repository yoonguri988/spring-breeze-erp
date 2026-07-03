package com.sb.erp.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.sb.erp.dao.EmpMapper;
import com.sb.erp.dto.EmpAuthDto;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.EmpSearchDto;


@Service
public class EmpServiceImpl implements EmpService {
	@Autowired EmpMapper dao;
	@Autowired PasswordEncoder passEncoder;
		
	// empId로 사원 정보 찾기
	@Override
	public EmpDto selectByEmpId(int empId, int comId) {
		return dao.selectByEmpId(empId, comId);
	}
	
	// 사원 정보 검색
	@Override
	public List<EmpDto> search(EmpSearchDto dto, int comId) {
		dto.setComId(comId);
		dto.setPstartno((dto.getPstartno()-1)*dto.getOnepagelist());
		return dao.search(dto);
	}
	
	// 사원 정보 등록
	@Override
	public int insert(EmpDto dto, int comId) {
		dto.setComId(comId);
		dto.setEmpPass(passEncoder.encode(dto.getEmpNo()));
		
		if(dto.getEmpStatus() == null || dto.getEmpStatus().isEmpty()) {
			dto.setEmpStatus("재직");
		}
		return dao.insert(dto);
	}
	
	@Override
	public int update(EmpDto dto, int comId) {
		dto.setComId(comId);
	    return dao.update(dto);
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
	
	/* paging */
	@Override
	public int selectCnt(EmpSearchDto dto, int comId) {
		dto.setComId(comId);
		return dao.selectCnt(dto);
	}
	
	// 이메일 중복검사
	@Override
	public boolean isEmailDuplicate(String empEmail) {
		return dao.countByEmpEmail(empEmail) > 0;
	}
	
	// 모바일 중복검사
	@Override
	public boolean isMobileDuplicate(String empMobile) {
		return dao.countByEmpMobile(empMobile) > 0;
	}
	
	// 사번 중복검사
	@Override
	public boolean isEmpNoDuplicate(String empNo, int comId) {
		return dao.countByEmpNo(empNo, comId) > 0;
	}
	
	// 기존 비밀번호와 일치 확인
	@Override
	public boolean matchPassword(EmpDto dto) {
		String existsPass = dao.selectPassById(dto.getEmpId());
		return passEncoder.matches(dto.getEmpPass(), existsPass);
	}
	
	// 해당 부서 id를 통해 사원정보 조회
	@Override
	public List<EmpDto> selectByDeptId(int deptId) {
		return dao.selectByDeptId(deptId);
	}
	
	// 회사 아이디를 기준으로 권한 정보와 엮여있는 사원 정보 확인
	@Override
	public List<EmpAuthDto> selectAuthByComId(int comId) {
		return dao.selectAuthByComId(comId);
	}

	// 비밀번호 분실 - session(empId) 기반, 본인확인 후에만 진입 가능
	@Override
	public Object selectAuthByEmpId(int empId) {
		return dao.selectAuthByEmpId(empId);
	}
	
}