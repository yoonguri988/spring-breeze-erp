package com.sb.erp.sal.dto.request;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 급여등록(산정) 요청. 
 * 기본급은 직원의 현재 급여기준에서 자동 산정되며, 수당/공제 항목만 입력받는다.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SalaryPaymentCreateRequest {

    @NotNull(message = "직원 정보는 필수입니다.")
    private Long empId;

    @NotNull(message = "지급월은 필수입니다.")
    private LocalDate payMonth;

    @Valid
    @NotEmpty(message = "수당/공제 항목이 최소 1건 이상 필요합니다.")
    private List<SalaryPaymentItemRequest> items;
}
