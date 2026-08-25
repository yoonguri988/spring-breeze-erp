package com.sb.erp.appr.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.appr.dto.request.ApprFormDelegationConfigRequest;
import com.sb.erp.appr.dto.response.ApprFormDelegationConfigResponse;
import com.sb.erp.appr.entity.ApprForm;
import com.sb.erp.appr.entity.ApprFormDelegationConfig;
import com.sb.erp.appr.entity.ApprFormId;
import com.sb.erp.appr.repository.ApprFormDelegationConfigRepository;
import com.sb.erp.appr.repository.ApprFormRepository;
import com.sb.erp.global.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApprFormDelegationConfigServiceImpl implements ApprFormDelegationConfigService{

	private final ApprFormDelegationConfigRepository cfgDao;
	private final ApprFormRepository formDao;
	
	// 저장
	// id + version 유니크 기준으로 없으면 생성, 있으면 더티체킹으로 갱신
	@Override
	@Transactional
	public Long save(ApprFormDelegationConfigRequest req) {
		
		ApprForm form = formDao.findById(new ApprFormId(req.getForId(), req.getForVersion()))
				.orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 양식입니다."));
		
		ApprFormDelegationConfig cfg = cfgDao
				.findByApprForm_ForIdAndApprForm_ForVersion(req.getForId(), req.getForVersion())
				.orElse(null);
		
		if (cfg == null) {
			cfg = ApprFormDelegationConfig.builder()
					.apprForm(form)
					.enabled(req.getEnabled())
					.startFieldId(req.getStartFieldId())
					.endFieldId(req.getEndFieldId())
					.delegateFieldId(req.getDelegateFieldId())
					.minTriggerDays(req.getMinTriggerDays())
					.build();
			cfgDao.save(cfg);
		}
		else {
			cfg.setEnabled(req.getEnabled());
			cfg.setStartFieldId(req.getStartFieldId());
			cfg.setEndFieldId(req.getEndFieldId());
			cfg.setDelegateFieldId(req.getDelegateFieldId());
			cfg.setMinTriggerDays(req.getMinTriggerDays());
		}
		
		return cfg.getCfgId();
	}

	@Override
	public ApprFormDelegationConfigResponse getByForm(Long forId, Long forVersion) {
		return cfgDao.findByApprForm_ForIdAndApprForm_ForVersion(forId, forVersion)
				.map(ApprFormDelegationConfigResponse::new)
				.orElse(null);
	}

}
