package com.sb.erp.dashboard.admin.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class AdminDashboardSummaryResponse {

    // A 영역 — 사원 프로필 (JWT에 없는 deptName 등 보충)
    private String empName;
    private String deptName;
    private String posName;

    // A 영역 — 오늘 내 근태
    private TodayAttDto todayAtt;

    // A 영역 — 내 연차 잔여
    private BigDecimal leaveTotalDays;
    private BigDecimal leaveUsedDays;
    private BigDecimal leaveRemainingDays;

    // B 영역 — 전사 출퇴근 통계
    private int totalEmployees;
    private int presentCount;
    private int lateCount;
    private int absentCount;
    private int leaveCount;

    // C 영역 — 주간 근태 추이
    private List<DailyAttStatDto> weeklyStats;

    // D 영역 — 결재 대기 건수
    private int pendingApprovalCount;

    @Getter @Builder
    public static class TodayAttDto {
        private Long attId;
        private String checkIn;
        private String checkOut;
        private String attStatus;
    }

    @Getter @Builder
    public static class DailyAttStatDto {
        private String date;
        private int present;
        private int late;
        private int absent;
        private int leave;
    }
}