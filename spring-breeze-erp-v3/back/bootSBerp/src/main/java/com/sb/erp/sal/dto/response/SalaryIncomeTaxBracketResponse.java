package com.sb.erp.sal.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.sb.erp.sal.entity.SalIncTaxBrkt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 필드명은 sal_inc_tax_brkt 테이블 컬럼명과 1:1로 동일하다(JSON 키도 동일). */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SalaryIncomeTaxBracketResponse {

    private Long brkt_id;
    private Long min_amt;
    private Long max_amt;
    private BigDecimal tax_rate;
    private LocalDate eff_from;
    private LocalDate eff_to;
    private LocalDateTime creat_at;

    /** 부양가족 수 미반영 근사치임을 화면에서도 항상 노출하기 위한 고정 안내 문구 (엔티티에 저장하지 않는 상수) */
    public String getDisclaimer() {
        return "부양가족 수 미반영, 실제 원천징수세액과 차이 있을 수 있음(포트폴리오/데모 목적의 근사치)";
    }

    public static SalaryIncomeTaxBracketResponse from(SalIncTaxBrkt entity) {
        return SalaryIncomeTaxBracketResponse.builder()
                .brkt_id(entity.getBrktId())
                .min_amt(entity.getMinAmt())
                .max_amt(entity.getMaxAmt())
                .tax_rate(entity.getTaxRate())
                .eff_from(entity.getEffFrom())
                .eff_to(entity.getEffTo())
                .creat_at(entity.getCreatAt())
                .build();
    }
}
