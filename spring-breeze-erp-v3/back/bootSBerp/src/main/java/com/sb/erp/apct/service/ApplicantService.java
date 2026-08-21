package com.sb.erp.apct.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.apct.dto.request.ApplicantRequest;
import com.sb.erp.apct.dto.response.MyApplicationResponse;
import com.sb.erp.apct.entity.Applicant;
import com.sb.erp.apct.oauth2.ApplicantPrincipal;
import com.sb.erp.apct.repository.ApplicantRepository;
import com.sb.erp.rec.entity.Recruit;
import com.sb.erp.rec.repository.RecruitRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApplicantService {

    private final ApplicantRepository applicantRepository;
    private final RecruitRepository recruitRepository;

    @Transactional
    public Long apply(ApplicantRequest req, Authentication authentication) {
        // ── 기존 그대로, 변경 없음 ──
        ApplicantPrincipal applicant = (ApplicantPrincipal) authentication.getPrincipal();

        Recruit recruit = recruitRepository.findById(req.getRecId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공고입니다."));

        if (!"OPEN".equals(recruit.getRecStatus())) {
            throw new IllegalStateException("현재 지원할 수 없는 공고입니다.");
        }

        boolean alreadyApplied = applicantRepository
                .existsByRecruit_RecIdAndProviderAndProviderId(
                        req.getRecId(), applicant.getProvider(), applicant.getProviderId());
        if (alreadyApplied) {
            throw new IllegalStateException("이미 지원한 공고입니다.");
        }

        String email = (req.getApctEmail() != null && !req.getApctEmail().isBlank())
                ? req.getApctEmail()
                : applicant.getEmail();

        Applicant entity = Applicant.builder()
                .company(recruit.getCompany())
                .recruit(recruit)
                .apctName(req.getApctName())
                .provider(applicant.getProvider())
                .providerId(applicant.getProviderId())
                .apctEmail(email)
                .apctPhone(req.getApctPhone())
                .apctStatus("RECEIVED")
                .build();

        Applicant saved = applicantRepository.save(entity);
        return saved.getApctId();
    }

    // ── 내 지원현황 조회 (추가) ──────────────────────────
    public List<MyApplicationResponse> getMyApplications(Authentication authentication) {
        ApplicantPrincipal applicant = (ApplicantPrincipal) authentication.getPrincipal();

        List<Object[]> rows = applicantRepository.findMyApplications(
                applicant.getProvider(), applicant.getProviderId());

        return rows.stream()
                .map(this::mapToMyApplicationResponse)
                .collect(Collectors.toList());
    }

    private MyApplicationResponse mapToMyApplicationResponse(Object[] row) {
        // Applicant 컬럼 순서: apct_id, com_id, rec_id, apct_name,
        // apct_provider, apct_provider_id, apct_email, apct_phone,
        // apct_status, apct_date, created_at, updated_at, (그다음) recTitle
        Long apctId = ((Number) row[0]).longValue();
        String apctStatus = (String) row[8];
        String apctDate = row[9] != null ? row[9].toString() : null;
        String recTitle = (String) row[row.length - 1];

        return new MyApplicationResponse(apctId, recTitle, apctStatus, apctDate);
    }

    // ── (관리자용) 상태 변경 (추가) ────────────────────────
    @Transactional
    public void updateStatus(Long apctId, String newStatus) {
        Applicant applicant = applicantRepository.findById(apctId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 지원자입니다."));
        applicant.setApctStatus(newStatus);
    }
}