package com.sb.erp.sal.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.sb.erp.sal.entity.SalPosAlw;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 필드명은 sal_pos_alw 테이블 컬럼명과 1:1로 동일하다(JSON 키도 동일). */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SalaryPositionAllowanceResponse {

    private Long alw_id;
    private String pos;
    private Long com_id;
    private Long amt;
    private LocalDate eff_from;
    private LocalDate eff_to;
    private LocalDateTime creat_at;

    public static SalaryPositionAllowanceResponse from(SalPosAlw entity) {
        return SalaryPositionAllowanceResponse.builder()
                .alw_id(entity.getAlwId())
                .pos(entity.getPos())
                .com_id(entity.getComId())
                .amt(entity.getAmt())
                .eff_from(entity.getEffFrom())
                .eff_to(entity.getEffTo())
                .creat_at(entity.getCreatAt())
                .build();
    }
}
