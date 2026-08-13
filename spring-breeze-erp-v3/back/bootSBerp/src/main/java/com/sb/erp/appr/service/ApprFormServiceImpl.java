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
import com.sb.erp.global.exception.ResourceNotFoundException;
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
		// 검색 조건에 맞는 전체 건수 먼저 조회
		int totalCnt = formMapper.listFormCnt(condition);
		
		// 전체 건수 기준으로 페이징 계산
		PagingUtil paging = new PagingUtil(totalCnt, condition.getPage());
		condition.setPstartno(paging.getPstartno());
		condition.setOnepagelist(paging.getOnepagelist());
		
		// 실제 목록 조회
		List<ApprFormResponse> list = formMapper.selectFormList(condition);
		
		return new ApprFormListResponse(list, condition.getPage(), condition.getOnepagelist(), totalCnt) ;
	}

	@Override
	public ApprFormResponse getForm(Long forId, Long forVersion) {
		ApprFormResponse form = formMapper.selectFormAll(forId, forVersion);
		
		// 없는 양식을 조회할때 예외 처리
		if (form == null) {
			throw new ResourceNotFoundException("존재하지 않는 양식입니다.");
		}
		return form;
	}

	@Override
	public List<ApprFormResponse> getFormVersions(Long forId) {
		// 특정 Id의 모든 버전을 조회
		return formMapper.selectFormVersions(forId);
	}

	@Override
	@Transactional
	public Long insertForm(ApprFormRequest req) {
		
		// forStatus가 null 로 들어왔을때 false 처리
		if(req.getForStatus() == null) {
			req.setForStatus(false);
		}
		
		// forContent / forSchema 둘중 하나만 있는지 검증	
		validateContentXor(req);
		
		formMapper.insertForm(req);
		// for_id를 시퀀스로 조회해서 반환
		return formMapper.selectCurrentFormSeq();
	}

	@Override
	@Transactional
	public void updateForm(Long forId, Long forVersion, ApprFormRequest req) {
		
		// forContent / forSchema 둘중 하나만 있는지 검증	
		validateContentXor(req);
		
		// 원본 데이터 조회 ( 변경 여부 비교 )
		ApprFormResponse original = formMapper.selectFormAll(forId, forVersion);
		if(original == null) {
			throw new ResourceNotFoundException("존재하지 않는 양식입니다.");
		}
		
		// 공백을 제외한 순수 텍스트 비교
		// 제목/내용/스키마 중 하나라도 바뀌었는지 확인
		boolean changed = 
				!normalize(original.getForContent()).equals(normalize(req.getForContent())) ||
				!normalize(original.getForTitle()).equals(normalize(req.getForTitle())) ||
				!normalize(original.getForSchema()).equals(normalize(req.getForSchema()));

		// 내용이 바뀐경우 버전 처리
		if(changed) {
			formMapper.updateFormNewVersion(forId, req);
		}
		// 같은 경우 버전 처리하지않고 update
		else {
			formMapper.updateForm(forId, forVersion, req);
		}
	}

	@Override
	@Transactional
	public void deleteForm(Long forId, Long forVersion) {
		
		int result = formMapper.deleteForm(forId, forVersion);
		
		// 대상이 없어서 0건 갱신됐다면 예외처리
		if (result == 0) {
			throw new ResourceNotFoundException("존재하지 않는 양식이거나 이미 삭제되었습니다.");
		}
		
	}

	@Override
	public CodeCheckResponse checkCode(String forCode, Long comId, Long forId) {
		
		// forId가 있으면 본인 제외하고 검사
		// 수정 화면에서 자기 코드는 중복으로 잡히면 안됨
		String find = formMapper.findByCode(forCode, comId, forId);
		
		return CodeCheckResponse.of(find == null);
	}
	
}
