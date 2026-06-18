package com.sb.erp.service;
import java.util.List;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.EmpSearchDto;
public interface EmpService {
	
	public List<EmpDto> selectAll(); 
	public EmpDto selectByEmpId(int empId);
	public List<EmpDto> search(EmpSearchDto dto);
	public int insert(EmpDto dto);
	public int update(EmpDto dto);
	// 비밀번호 찾기시 해당하는 사원 정보가 있는지 확인
	public EmpDto selectForVerify(EmpDto dto);
	// 비밀번호 재설정
	public int updatePassByEmpId(EmpDto dto);
	// 이메일을 기준으로 사용자 정보 확인
	public EmpDto selectByEmpEmail(String empEmail);
	

}