package com.sb.erp.sal.service;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.global.security.ActorContext;
import com.sb.erp.sal.dto.request.SalaryMealAllowancePolicyCreateRequest;
import com.sb.erp.sal.dto.response.SalaryMealAllowancePolicyResponse;
import com.sb.erp.sal.entity.SalMealAlwPlcy;
import com.sb.erp.sal.repository.SalaryMealAllowancePolicyRepository;

import lombok.RequiredArgsConstructor;

/**
 * 식대 정책(sal_meal_alw_plcy) 관리. MealAllowanceCalculator가 이 값을 조회해 자동 산정한다.
 * com_id가 NULL인 정책은 전사 공통 기본값(fallback)이며 ROOT만 등록할 수 있다. com_id가 있는 정책은
 * 해당 회사 전용이며 그 회사 ADMIN도 등록할 수 있다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SalaryMealAllowancePolicyService {

    private final SalaryMealAllowancePolicyRepository salaryMealAllowancePolicyRepository;

    @Transactional
    public SalaryMealAllowancePolicyResponse register(SalaryMealAllowancePolicyCreateRequest request, ActorContext actor) {
        Long comId = request.getCom_id();

        if (comId == null) {
            if (!actor.root()) {
                throw new AccessDeniedException("전사 공통 식대 기본값(com_id 없음)은 ROOT만 등록할 수 있습니다.");
            }
        } else if (!actor.canAccessCompany(comId)) {
            throw new AccessDeniedException("다른 회사의 식대 정책은 등록할 수 없습니다.");
        }

        // 동일 com_id(NULL 포함) 중 기존에 유효 중이던 정책은 신규 정책 시작일 전날짜로 종료 처리(이력 보존)
        salaryMealAllowancePolicyRepository.findByComIdAndEffToIsNull(comId)
                .ifPresent(prev -> prev.closeAsHistory(request.getEff_from().minusDays(1)));

        SalMealAlwPlcy entity = SalMealAlwPlcy.builder()
                .comId(comId)
                .amt(request.getAmt())
                .effFrom(request.getEff_from())
                .build();

        SalMealAlwPlcy saved = salaryMealAllowancePolicyRepository.save(entity);
        return SalaryMealAllowancePolicyResponse.from(saved);
    }

    public List<SalaryMealAllowancePolicyResponse> findAll(ActorContext actor) {
        // ROOT는 전체(전사 공통 fallback 포함) 조회, 그 외는 목록에서 자기 회사 것만 필터링
        return salaryMealAllowancePolicyRepository.findAllByOrderByComIdAscEffFromDesc().stream()
                .filter(entity -> actor.root() || (entity.getComId() != null && entity.getComId().equals(actor.comId())))
                .map(SalaryMealAllowancePolicyResponse::from)
                .toList();
    }
}
