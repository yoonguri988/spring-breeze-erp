package com.sb.erp.sal.calc.calculator;

import java.time.YearMonth;

import org.springframework.stereotype.Component;

import com.sb.erp.emp.entity.Employee;
import com.sb.erp.sal.calc.SalPayItemCandidate;
import com.sb.erp.sal.calc.SalaryItemCalculator;
import com.sb.erp.sal.entity.SalStd;
import com.sb.erp.sal.entity.type.SalaryItemCode;

/**
 * 연차수당(ANNUAL_LEAVE_ALLOWANCE) 계산기 - 스텁.
 *
 * TODO: 연차 모듈(leave_grant, emp_leave_balance) 완성 후 연동.
 * 계산식(확정 필요): 미사용 연차일수 = leave_grant.total - emp_leave_balance.used
 *              일급 = baseSal / 209 * 8 (통상임금 산정 방식은 인사팀 확인 후 최종 확정)
 *              연차수당 = 미사용 연차일수 * 일급
 * 현재는 연차 데이터에 접근할 수 없으므로 0원으로 산정하고 calcBasis에 "미연동"을 명시한다.
 * 관리자 화면에서는 이 항목을 "수동 조정 필요" 상태로 하이라이트 처리하는 것을 권장한다
 * (Draft/PENDING 단계에서 PATCH /api/salpay/{payId}/items/{itemId}로 조정 가능).
 *
 * 연차/근태 모듈이 완성되면 이 클래스 내부만 교체하면 되고 SalaryCalculationService나 호출부는
 * 수정할 필요가 없다(Strategy 패턴의 이점).
 */
@Component
public class AnnualLeaveAllowanceCalculator implements SalaryItemCalculator {

    @Override
    public SalaryItemCode getItemCode() {
        return SalaryItemCode.ANNUAL_LEAVE_ALLOWANCE;
    }

    @Override
    public SalPayItemCandidate calculate(SalStd std, Employee employee, YearMonth payMonth) {
        return new SalPayItemCandidate(getItemCode(), 0L, "연차 모듈 미연동 - 수동 확인 필요");
    }
}
