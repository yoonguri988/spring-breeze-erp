package com.sb.erp.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sb.erp.dao.EmpMapper;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.EmpSearchDto;
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
		return dao.selectByEmpId(empId);
	}
	@Override
	public List<EmpDto> search(EmpSearchDto dto) {
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

	
}