package com.sb.erp.dashboard.admin.service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.att.entity.Attendance;
import com.sb.erp.att.entity.LeaveBalance;
import com.sb.erp.att.repository.AttendanceRepository;
import com.sb.erp.att.repository.LeaveBalanceRepository;
import com.sb.erp.dashboard.admin.dto.AdminDashboardSummaryResponse;
import com.sb.erp.dashboard.admin.dto.AdminDashboardSummaryResponse.DailyAttStatDto;
import com.sb.erp.dashboard.admin.dto.AdminDashboardSummaryResponse.TodayAttDto;
import com.sb.erp.emp.repository.EmpRepository;

import lombok.RequiredArgsConstructor;


/*
 대시보드에 필요한 데이터를 여러 Repository에서 모아 조합하는 서비스
 Controller가 대시보드 데이터를 요청하면
 AttendanceRepository - 오늘/주간 근태
 LeaveBalanceRepository - 연차 잔여 현황
 empRepository - 재직 사원 ID 목록
 세 곳에서 데이터를 가져와 AdminDashboardSummaryResponse 하나로 만들어 돌려준다.
*/

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDashboardService {

    private final AttendanceRepository attendanceRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final EmpRepository empRepository;

    private static final DateTimeFormatter TIME_FMT =
            DateTimeFormatter.ofPattern("HH:mm");

    public AdminDashboardSummaryResponse getSummary(Long empId, Long comId) {

        LocalDate today = LocalDate.now();
        int currentYear = today.getYear();

        // 1) 사용자의 오늘 근태
        TodayAttDto todayAtt = buildTodayAtt(empId, today);

        // 2) 사용자의 연차 잔여
        BigDecimal leaveTotalDays = BigDecimal.ZERO;
        BigDecimal leaveUsedDays = BigDecimal.ZERO;
        BigDecimal leaveRemainingDays = BigDecimal.ZERO;

        Optional<LeaveBalance> myBalance =
                leaveBalanceRepository.findByEmployee_EmpIdAndYear(empId, currentYear);
        
        // myBalance의 값이 있다면 넣고 아니라면 0 유지
        if (myBalance.isPresent()) {
            LeaveBalance lb = myBalance.get();
            leaveTotalDays = lb.getTotalDays();
            leaveUsedDays = lb.getUsedDays();
            leaveRemainingDays = lb.getRemainingDays();
        }

        // 3) 전사 오늘 출퇴근 통계
        List<Long> activeEmpIds = empRepository.findActiveEmpIdsByComId(comId);
        int totalEmployees = activeEmpIds.size();
        
        // 오늘의 근태 레코드 찾고
        Map<String, Integer> todayStats = countAttStatusByDate(activeEmpIds, today);
        
        // 상태별로 집계하기
        int presentCount = todayStats.getOrDefault("NORMAL", 0);
        int lateCount = todayStats.getOrDefault("LATE", 0);
        int leaveCount = todayStats.getOrDefault("LEAVE", 0);
        int earlyLeaveCount = todayStats.getOrDefault("EARLY_LEAVE", 0);
        int recordedCount = presentCount + lateCount + earlyLeaveCount + leaveCount;
        
        // 미출근 수 = 전체 인원 - 근태 기록이 있는 인원. 
        // 근태 테이블에 레코드가 없는 사원은 아직 출근을 안 한 것이므로, 역으로 계산
        // Math.max(0, ...)은 혹시 데이터 불일치로 음수가 되는 것을 방지
        int absentCount = Math.max(0, totalEmployees - recordedCount);

        // 4) 주간 통계
        // 최근 5영업일의 일별 통게를 모아서 Chart.js 데이터로 활용
        List<DailyAttStatDto> weeklyStats =
                buildWeeklyStats(activeEmpIds, today, totalEmployees);

        // 5) 결재 대기 건수 — 추후 ApprDoc 연동할 예정
        int pendingApprovalCount = 0;

        return AdminDashboardSummaryResponse.builder()
                .todayAtt(todayAtt)
                .leaveTotalDays(leaveTotalDays)
                .leaveUsedDays(leaveUsedDays)
                .leaveRemainingDays(leaveRemainingDays)
                .totalEmployees(totalEmployees)
                .presentCount(presentCount)
                .lateCount(lateCount)
                .absentCount(absentCount)
                .leaveCount(leaveCount)
                .weeklyStats(weeklyStats)
                .pendingApprovalCount(pendingApprovalCount)
                .build();
    }
    
    // Optional.map() 패턴
    // 레코드가 있으면 DTO로 변환하고, 없으면 .orElse(null)로 null을 반환
    private TodayAttDto buildTodayAtt(Long empId, LocalDate today) {
        return attendanceRepository.findByEmployee_EmpIdAndAttDate(empId, today)
                .map(att -> TodayAttDto.builder()
                        .attId(att.getAttId())
                        .checkIn(att.getCheckIn() != null
                                ? att.getCheckIn().format(TIME_FMT) : null)
                        .checkOut(att.getCheckOut() != null
                                ? att.getCheckOut().format(TIME_FMT) : null)
                        .attStatus(att.getAttStatus())
                        .build())
                .orElse(null);
    }

    private Map<String, Integer> countAttStatusByDate(
            List<Long> activeEmpIds, LocalDate date) {
    	
        List<Attendance> records = attendanceRepository.findByAttDateAndEmployee_EmpIdIn(date, activeEmpIds);

        Map<String, Integer> result = new HashMap<>();
        for (Attendance a : records) {
            String status = a.getAttStatus();
            
            // 연차, 오전 반차, 오후 반차를 모두 LEAVE로 통합 집계
            if ("ANNUAL".equals(status) || "AM_HALF".equals(status) || "PM_HALF".equals(status)) {
                status = "LEAVE";
            }
            result.merge(status, 1, Integer::sum);
        }
        return result;
    }

    
    private List<DailyAttStatDto> buildWeeklyStats(
            List<Long> activeEmpIds, LocalDate today, int totalEmployees) {

        List<DailyAttStatDto> stats = new ArrayList<>();
        LocalDate cursor = today;
        int count = 0;
        
        // 금일을 기준으로 역순으로 돌면서 주말을 건너뛰고 5영업일을 수집
        while (count < 5) {
            if (cursor.getDayOfWeek() != DayOfWeek.SATURDAY
                    && cursor.getDayOfWeek() != DayOfWeek.SUNDAY) {

                Map<String, Integer> dayStat = countAttStatusByDate(activeEmpIds, cursor);
                int present = dayStat.getOrDefault("NORMAL", 0)
                        + dayStat.getOrDefault("EARLY_LEAVE", 0);
                int late = dayStat.getOrDefault("LATE", 0);
                int leave = dayStat.getOrDefault("LEAVE", 0);
                int absent = Math.max(0, totalEmployees - present - late - leave);
                
                stats.add(DailyAttStatDto.builder()
                        .date(cursor.toString())
                        .present(present)
                        .late(late)
                        .absent(absent)
                        .leave(leave)
                        .build());
                count++;
            }
            cursor = cursor.minusDays(1);
        }
        // Collections.reverse() 날짜 오름차순 정렬
        // chart.js에서 과거→현재 순으로 정렬되도록 함
        Collections.reverse(stats);
        return stats;
    }
}
