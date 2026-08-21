package com.sb.erp.sal.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 7-4 급여수정 요청 (대기 상태 건의 수당/공제 세부금액 수정) */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryPaymentUpdateRequest {

    @Valid
    @NotEmpty(message = "수당/공제 항목이 최소 1건 이상 필요합니다.")
    private List<SalaryPaymentItemRequest> items;
}
