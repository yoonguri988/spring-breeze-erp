package com.sb.erp.appr.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.sb.erp.appr.dto.request.ApprFormRequest;
import com.sb.erp.appr.dto.request.ApprFormSearchCondition;
import com.sb.erp.appr.dto.response.ApprFormListResponse;
import com.sb.erp.appr.dto.response.ApprFormResponse;
import com.sb.erp.appr.dto.response.CodeCheckResponse;
import com.sb.erp.appr.repository.ApprFormMapper;
import com.sb.erp.util.dto.PagingUtil;

import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApprFormServiceImpl implements ApprFormService {
	
	private final ApprFormMapper formMapper;
	
	// 양식 content/schema 방어코드
	// forContent 또는 forSchema 중 한쪽에만 데이터가 들어가야 정상
	private void validateContentXor(ApprFormRequest req) {
		// StringUtils.hasText() 내용이 있는 텍스트인지 확인함 아래 코드와 동일
		// boolean ~~~ = dto.getForContent() != null && !dto.getForContent().isBlank();
		boolean hasContent = StringUtils.hasText(req.getForContent());
		boolean hasSchema = StringUtils.hasText(req.getForSchema());
		
		if(hasContent == hasSchema) {
			throw new IllegalArgumentException("양식 내용은 에디터 작성 또는 AI 생성 중 하나만 선택해야합니다.");
		}
	}

	// 공백/줄바꿈 제거 -> 순수 텍스트만 비교 ( 버전 증가 판단용 )
	private String normalize(String value) {
		return value == null ? "" : value.replaceAll("\\s+", "");
	}
	
	@Override
	public ApprFormListResponse listForms(ApprFormSearchCondition condition) {
		int totalCnt = formMapper.listFormCnt(condition);
		
		// 페이징..
		
		return null;
	}

	@Override
	public ApprFormResponse getForm(Long forId, Long forVersion) {
		ApprFormResponse form = formMapper.selectFormAll(forId, forVersion);
		if (form == null) {
			throw new IllegalArgumentException("존재하지 않는 양식입니다.");
		}
		return null;
	}

	@Override
	public List<ApprFormResponse> getFormVersion(Long forId) {
		return formMapper.selectFormVersions(forId);
	}

	@Override
	public Long insertForm(ApprFormRequest req) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void updateForm(Long forId, Long forVersion, ApprFormRequest req) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteForm(Long forId, Long forVersion) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public CodeCheckResponse checkCode(String forCode, Long comId, Long forId) {
		// TODO Auto-generated method stub
		return null;
	}
	
}
