package com.sb.erp.sal.calc;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * 급여 산정 공통 유틸 - 원 단위 반올림(절사) 규칙.
 *
 * 4대보험료/소득세 계산은 실무 관행상 원 단위 절사(버림)를 기본으로 한다(공단 고지서도 절사 방식 사용).
 * 소수점 이하는 항상 버리고 Long으로 변환한다(design.md "원 단위 반올림 규칙(확정)" 참고).
 */
public final class SalaryCalculationSupport {

    private SalaryCalculationSupport() {
    }

    /** baseSal x rate 를 계산한 뒤 원 단위 절사(버림)하여 Long으로 반환한다. */
    public static Long applyRateAndTruncate(Long base, BigDecimal rate) {
        if (base == null || rate == null) {
            return 0L;
        }
        return truncate(BigDecimal.valueOf(base).multiply(rate));
    }

    /** 이미 계산된 금액에 다시 비율을 곱해서 절사한다(예: 장기요양보험료 = 건강보험료(절사된 값) x careRate). */
    public static Long applyRateAndTruncate(BigDecimal base, BigDecimal rate) {
        if (base == null || rate == null) {
            return 0L;
        }
        return truncate(base.multiply(rate));
    }

    /** BigDecimal 값을 소수점 이하 절사(버림)하여 Long으로 변환한다. */
    public static Long truncate(BigDecimal value) {
        if (value == null) {
            return 0L;
        }
        return value.setScale(0, RoundingMode.DOWN).longValueExact();
    }
}
