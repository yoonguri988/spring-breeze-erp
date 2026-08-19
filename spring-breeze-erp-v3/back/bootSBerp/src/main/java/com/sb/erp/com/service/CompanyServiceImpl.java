package com.sb.erp.com.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sb.erp.com.dto.request.ComRequest;
import com.sb.erp.com.dto.request.CompanySearchRequest;
import com.sb.erp.com.dto.response.ComResponse;
import com.sb.erp.com.dto.response.StatsComResponse;
import com.sb.erp.com.repository.CompanyMapper;
import com.sb.erp.dept.repository.DeptMapper;
import com.sb.erp.global.exception.ResourceNotFoundException;
import com.sb.erp.util.dto.FileUploadDto;
import com.sb.erp.util.dto.FileUploadType;
import com.sb.erp.util.dto.FileUploadUtil;

@Service
public class CompanyServiceImpl implements CompanyService {
	@Autowired CompanyMapper dao;
	@Autowired DeptMapper deptDao;

	@Override
	public List<ComResponse> list(CompanySearchRequest dto) {
		// keyword, onepagelist, (pstarValue-1)*onepagelist
		dto.setPstartno((dto.getPstartno()-1)*dto.getOnepagelist());
		return dao.selectAll(dto);
	}

	@Override
	public int add(ComRequest dto, MultipartFile logoFile) {
		if (logoFile != null && !logoFile.isEmpty()) {
			FileUploadDto uploaded = FileUploadUtil.upload(logoFile, FileUploadType.COMPANY_LOGO);
			dto.setComLogo(uploaded.getFileUrl());
		}
		
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
	public ComResponse selectOneById(long comId) {
		return dao.selectOneById(comId);
	}

	@Override
	public int update(long comId, ComRequest dto, MultipartFile logoFile) {
		ComResponse before = dao.selectOneById(comId);
		if (before == null) {
			throw new ResourceNotFoundException("존재하지 않는 회사입니다. comId=" + comId);
		}
 
		if (logoFile != null && !logoFile.isEmpty()) {
			// 새 로고가 왔으면 업로드 후 URL 교체
			FileUploadDto uploaded = FileUploadUtil.upload(logoFile, FileUploadType.COMPANY_LOGO);
			dto.setComLogo(uploaded.getFileUrl());
		} else {
			// 새 로고 파일이 없으면 기존 값을 유지한다.
			dto.setComLogo(before.getComLogo());
		}
 
		int result = dao.update(dto);
 
		// 로고가 실제로 교체된 경우에만 기존 파일 정리
		if (result > 0 && before.getComLogo() != null && !before.getComLogo().equals(dto.getComLogo())) {
			FileUploadUtil.delete(FileUploadUtil.resolveDiskPath(before.getComLogo()));
		}
 
		return result;
	}

	@Override
	public int delete(long comId) {
		if(deptDao.countActiveDepts(comId) > 0) {
			throw new IllegalArgumentException("하위 부서가 존재하는 경우, 회사 삭제 불가능");
		}
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
	public ComResponse selectOneByEmpId(long empId) {
		return dao.selectOneByEmpId(empId);
	}

}