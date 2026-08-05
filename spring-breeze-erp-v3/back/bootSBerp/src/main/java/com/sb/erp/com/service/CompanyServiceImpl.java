package com.sb.erp.com.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.com.dto.request.ComRequest;
import com.sb.erp.com.dto.request.CompanySearchRequest;
import com.sb.erp.com.dto.response.ComResponse;
import com.sb.erp.com.dto.response.StatsComResponse;
import com.sb.erp.com.repository.CompanyMapper;

@Service
public class CompanyServiceImpl implements CompanyService {
	@Autowired CompanyMapper dao;
//	@Autowired DeptMapper deptDao;

	@Override
	public List<ComResponse> list(CompanySearchRequest dto) {
		// keyword, onepagelist, (pstarValue-1)*onepagelist
		dto.setPstartno((dto.getPstartno()-1)*dto.getOnepagelist());
		return dao.selectAll(dto);
	}

	@Override
	public int add(ComRequest dto) {
		if(dto.getBizNo() != null && dao.selectByBizNo(dto.getBizNo()) != null) {
			throw new IllegalArgumentException("중복된 사업자 번호");
		}
		return dao.insert(dto);
	}

	@Override
	public ComResponse isDuplicateBizNo(String bizNo) {
		return dao.selectByBizNo(bizNo);
	}

	@Override
	public ComResponse selectOneById(int comId) {
		return dao.selectOneById(comId);
	}

	@Override
	public int update(ComRequest dto) {
		return dao.update(dto);
	}

	@Override
	public int delete(int comId) {
//		if(deptDao.countActiveDepts(comId) > 0) {
//			throw new IllegalArgumentException("하위 부서가 존재하는 경우, 회사 삭제 불가능");
//		}
		return dao.delete(comId);
	}

	@Override
	public List<ComResponse> getSuggest(String keyword) {
		return dao.selectSuggest(keyword);
	}

	@Override
	public int listTotal(CompanySearchRequest search) {
		return dao.listTotal(search);

	}

	@Override
	public StatsComResponse selectStats() {
		return dao.selectStats();
	}

	@Override
	public ComResponse selectOneByEmpId(int empId) {
		return dao.selectOneByEmpId(empId);
	}

}
