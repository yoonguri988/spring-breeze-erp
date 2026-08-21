package com.sb.erp.sal.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.sb.erp.sal.entity.SalRatePlcy;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 필드명은 sal_rate_plcy 테이블 컬럼명과 1:1로 동일하다(JSON 키도 동일). */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SalaryRatePolicyResponse {

    private Long rate_id;
    private Integer plcy_year;
    private BigDecimal pens_rate;
    private BigDecimal hlth_rate;
    private BigDecimal care_rate;
    private BigDecimal empl_rate;
    private LocalDate eff_from;
    private LocalDate eff_to;
    private LocalDateTime creat_at;

    public static SalaryRatePolicyResponse from(SalRatePlcy entity) {
        return SalaryRatePolicyResponse.builder()
                .rate_id(entity.getRateId())
                .plcy_year(entity.getPlcyYear())
                .pens_rate(entity.getPensRate())
                .hlth_rate(entity.getHlthRate())
                .care_rate(entity.getCareRate())
                .empl_rate(entity.getEmplRate())
                .eff_from(entity.getEffFrom())
                .eff_to(entity.getEffTo())
                .creat_at(entity.getCreatAt())
                .build();
    }
}
