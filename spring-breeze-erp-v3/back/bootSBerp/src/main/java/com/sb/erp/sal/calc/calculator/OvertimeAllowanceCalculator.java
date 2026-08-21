package com.sb.erp.sal.calc.calculator;

import java.time.YearMonth;

import org.springframework.stereotype.Component;

import com.sb.erp.emp.entity.Employee;
import com.sb.erp.sal.calc.SalPayItemCandidate;
import com.sb.erp.sal.calc.SalaryItemCalculator;
import com.sb.erp.sal.entity.SalStd;
import com.sb.erp.sal.entity.type.SalaryItemCode;

/**
 * 고정연장수당(OVERTIME_ALLOWANCE) 계산기 - 스텁.
 *
 * TODO: 근태 모듈(attendance.overtime_minutes) 완성 후 연동.
 * 계산식(확정): 시급 = baseSal / 209(월 소정근로시간) / 8
 *              고정연장수당 = overtimeMinutes / 60 * 시급 * 1.5(가산율)
 * 현재는 근태 데이터에 접근할 수 없으므로 0원으로 산정하고 calcBasis에 "미연동"을 명시한다.
 * 관리자 화면에서는 이 항목을 "수동 조정 필요" 상태로 하이라이트 처리하는 것을 권장한다.
 */
@Component
public class OvertimeAllowanceCalculator implements SalaryItemCalculator {

    @Override
    public SalaryItemCode getItemCode() {
        return SalaryItemCode.OVERTIME_ALLOWANCE;
    }

    @Override
    public SalPayItemCandidate calculate(SalStd std, Employee employee, YearMonth payMonth) {
        return new SalPayItemCandidate(getItemCode(), 0L, "근태 모듈 미연동 - 수동 확인 필요");
    }
}
