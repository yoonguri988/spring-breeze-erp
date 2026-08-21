package com.sb.erp.sal.dto.request;

import com.sb.erp.sal.entity.type.SalaryItemCode;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 급여 수당/공제 세부 항목 요청.
 * 항목명을 자유 텍스트로 입력하지 않고, 사전 정의된 {@link SalaryItemCode} 중에서 선택 후 금액만 입력한다.
 * 
 * 선택 가능한 코드 목록은 GET /api/salary-payments/item-codes 로 조회할 수 있다(프론트 드롭다운용).
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SalaryPaymentItemRequest {

    @NotNull(message = "항목 코드는 필수입니다.")
    private SalaryItemCode itemCode;

    @NotNull(message = "금액은 필수입니다.")
    @Positive(message = "금액은 0보다 커야 합니다.")
    private Long amt;
}
