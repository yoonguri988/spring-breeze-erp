package com.sb.erp.dashboard.admin.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class AdminDashboardSummaryResponse {

    // A 영역 — 오늘 내 근태
    private TodayAttDto todayAtt;

    // A 영역 — 내 연차 잔여
    private BigDecimal leaveTotalDays;
    private BigDecimal leaveUsedDays;
    private BigDecimal leaveRemainingDays;

    // B 영역 — 전사 출퇴근 통계
    private int totalEmployees; // 총 사원수
    private int presentCount;	// 출근한 사원 수
    private int lateCount;		// 지각한 사원 수
    private int absentCount;	// 결근한 사원 수
    private int leaveCount;		// 휴가중인 사원 수

    // C 영역 — 주간 근태 추이
    private List<DailyAttStatDto> weeklyStats;

    // D 영역 — 결재 대기 건수
    private int pendingApprovalCount;

    @Getter @Builder
    public static class TodayAttDto {
    	/* 
    		기존 AttendanceResponse는 LocalDateTime checkIn을 갖고 있지만, 
    		대시보드에서는 시:분만 보여주면 되므로 서버에서 미리 포맷팅해서 문자열로 내려준다.
    	*/
        private Long attId;
        private String checkIn;
        private String checkOut;
        private String attStatus;
    }


    @Getter @Builder
    public static class DailyAttStatDto {
    	/*
    		Chart.js의 datasets에 직접 매핑되는 구조
			date가 x축 라벨, 나머지 4개가 각 막대의 높이가 된다.
    	*/
        private String date;
        private int present;
        private int late;
        private int absent;
        private int leave;
    }
}
