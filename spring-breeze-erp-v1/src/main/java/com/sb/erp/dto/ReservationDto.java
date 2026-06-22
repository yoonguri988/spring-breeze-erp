package com.sb.erp.dto;

import lombok.Data;

@Data
public class ReservationDto {

    // 예약 PK
    private int revId;

    // 예약 대상 자원 ID
    private int resId;

    // 예약이 속한 회사 ID
    private int comId;

    // 예약 요청자 사원 ID
    private int empId;

    // 예약 요청 수량
    private int quantity;

    // 예약 상태: WAI / APP / REJ
    private String status;

    // 예약 요청일
    private String reqDate;

    // 요청 비고 또는 반려 사유
    private String remark;

    // 마지막 상태 변경 시각
    private String updatedAt;

    // 목록 화면 표시용 자원명
    private String resName;

    // 목록 화면 표시용 자원코드
    private String resCode;

    // 목록 화면 표시용 요청자명
    private String empName;

    // 목록 화면 표시용 부서명
    private String deptName;
}