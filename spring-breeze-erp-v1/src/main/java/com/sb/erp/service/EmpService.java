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
	

}