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
	public List<CompanyDto> list() {
		return dao.selectAll();
	}

	@Override
	public int add(CompanyDto dto) {
		// 사업자 번호 중복 검증
		if(dto.getBizNo() != null && dao.countByBizNo(dto.getBizNo()) > 0) {
			throw new IllegalArgumentException("이미 등록된 사업자번호입니다.");
		}
		return dao.insert(dto);
	}

	@Override
	public boolean isDuplicateBizNo(String bizNo) {
		return dao.countByBizNo(bizNo) > 0 ? true : false;
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
		// 진짜 삭제가 아닌 비활성화 처리 - 나중에 진짜 삭제 처리도 따로 구현
		return dao.softDelete(companyId);
	}

}
