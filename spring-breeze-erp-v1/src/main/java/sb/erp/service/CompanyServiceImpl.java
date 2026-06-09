package sb.erp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import sb.erp.dao.CompanyMapper;
import sb.erp.dao.DeptMapper;
import sb.erp.dto.CompanyDto;

@Service
public class CompanyServiceImpl implements CompanyService {
	@Autowired CompanyMapper dao;
	@Autowired DeptMapper deptDao;

	@Override
	public List<CompanyDto> list(String keyword, int onepagelist, int pstarValue) {
		return dao.selectAll(keyword, onepagelist, (pstarValue-1)*onepagelist);
	}

	@Override
	public int add(CompanyDto dto) {
		// 사업자 번호 중복 검증
		if(dto.getBizNo() != null && dao.selectByBizNo(dto.getBizNo()) != null) {
			throw new IllegalArgumentException("이미 등록된 사업자번호입니다.");
		}
		return dao.insert(dto);
	}

	@Override
	public CompanyDto isDuplicateBizNo(String bizNo) {
		return dao.selectByBizNo(bizNo);
	}

	@Override
	public CompanyDto selectOneById(int companyId) {
		return dao.selectOneById(companyId);
	}

	@Override
	public int update(CompanyDto dto) {
		return dao.update(dto);
	}

	@Override
	public int delete(int companyId) {
		// 소속된 부서가 존재한다면 회사 삭제 처리 불가
		if(deptDao.countActiveDepts(companyId) > 0) {
			throw new IllegalArgumentException("소속 부서가 존재하여 삭제할 수 없습니다.");
		}
		// 삭제 처리
		return dao.delete(companyId);
	}

	@Override
	public List<CompanyDto> getSuggest(String keyword) {
		return dao.selectSuggest(keyword);
	}

	@Override
	public int listTotal(String keyword) {
		return dao.listTotal(keyword);

	}

}
