package com.sb.erp.service;
import java.util.List;

import com.sb.erp.dto.EmpAuthDto;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.EmpSearchDto;
public interface EmpService {
	
	// 사원 목록
	public List<EmpDto> selectAll(int comId);

	// 상세 보기
	public EmpDto selectByEmpId(int empId, int comId);
	
	// 비로그인 상태시 본인 확인용
	public EmpDto selectByEmpId(int empId);

	// 사원 목록(검색)
	public List<EmpDto> search(EmpSearchDto dto, int comId);

	// 사원 등록
	public int insert(EmpDto dto, int comId);

	// 사원 정보 수정
	public int update(EmpDto dto, int comId);

	// 이메일, 모바일, 사번 중복 검사
	public boolean isEmailDuplicate(String empEmail);
	public boolean isMobileDuplicate(String empMobile);
	public boolean isEmpNoDuplicate(String empNo, int comId);
	

	/* paging */
	public int selectCnt(EmpSearchDto dto, int comId);

	// 비밀번호 찾기시 해당하는 사원 정보가 있는지 확인
	public EmpDto selectForVerify(EmpDto dto);

	// 비밀번호 재설정
	public int updatePassByEmpId(EmpDto dto);

	// 이메일을 기준으로 사용자 정보 확인
	public EmpDto selectByEmpEmail(String empEmail);
	
	// 기존 비밀번호와 일치 확인
	public boolean matchPassword(EmpDto dto);
	
	// 해당 부서 id를 통해 사원정보 조회
	public List<EmpDto> selectByDeptId(int deptId);
	
	// 회사 아이디를 기준으로 권한 정보와 엮여있는 사원 정보 확인
	public List<EmpAuthDto> selectAuthByComId(int comId);
	

}