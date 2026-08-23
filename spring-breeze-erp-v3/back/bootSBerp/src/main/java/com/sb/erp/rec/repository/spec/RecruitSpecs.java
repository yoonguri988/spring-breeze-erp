package com.sb.erp.rec.repository.spec;

import org.springframework.data.jpa.domain.Specification;

import com.sb.erp.rec.entity.Recruit;

import jakarta.persistence.criteria.Predicate;

public class RecruitSpecs {

    private RecruitSpecs() {}

    public static Specification<Recruit> search(Long comId, String recStatus) {
        return (root, query, cb) -> {
            Predicate predicate = cb.conjunction();

            if (comId != null) {                             // ★ 수정: null 체크 추가
                predicate = cb.and(predicate, cb.equal(root.get("company").get("comId"), comId));
            }
            if (recStatus != null) {
                predicate = cb.and(predicate, cb.equal(root.get("recStatus"), recStatus));
            }

            return predicate;
        };
    }
}