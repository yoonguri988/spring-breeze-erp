package com.sb.erp.att.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.att.dto.request.AttendanceRequest;
import com.sb.erp.att.dto.response.AttendanceResponse;
import com.sb.erp.att.entity.Attendance;
import com.sb.erp.att.repository.AttendanceRepository;
import com.sb.erp.emp.entity.Employee;
import com.sb.erp.emp.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceService {
	
	private final AttendanceRepository attendanceRepository;
	private final EmployeeRepository employeeRepository;
	
	
	//	목록 조회	읽기
	public List<AttendanceResponse> getAllAttendances(LocalDate startDate, LocalDate endDate, int start, int end){
		return attendanceRepository.findAttendanceWithPaging(startDate, endDate, start, end)
				.stream()
				.map(AttendanceResponse::from)
				.collect(Collectors.toList());
	}
	
	//	본인 조회	읽기
	public List<AttendanceResponse> getAttendanceByEmpId(Long empId){
		return attendanceRepository.findByEmployee_EmpId(empId)
				.stream()
				.map(AttendanceResponse::from)
				.collect(Collectors.toList());
	}
	
	// 출근 check-in
	@Transactional
	public AttendanceResponse checkIn(Long empId) {
		
		// 오늘 날짜
		LocalDate today = LocalDate.now();
				
		// 금일 출근 시 이미 출근 처리 되었는지/휴가 사용했는지 여부 확인
		Optional<Attendance> existing = attendanceRepository
				.findByEmployee_EmpIdAndAttDate(empId, today);
		
		if(existing.isPresent()) {
			String status = existing.get().getAttStatus();
			if("ANNUAL".equals(status)) {
				throw new IllegalArgumentException("연차가 등록된 날입니다.");
			}else if("AM_HALF".equals(status)) {
				throw new IllegalArgumentException("오전 반차가 등록된 날입니다.");
				// 오전 출근만 반려, 오후 출근 허용해야함... 나중에...
			}
			throw new IllegalArgumentException("이미 출근 처리되었습니다.");
		}
		
		// 현재 시각으로 출근 상태 판단(정상 출근/지각)
		LocalDateTime now = LocalDateTime.now();
		String status = now.toLocalTime().isAfter(LocalTime.of(9, 0))? "LATE" : "NORMAL";
		
		// Entity
		Employee emp = employeeRepository.findById(empId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사원입니다."));
		
		Attendance attendance = Attendance.builder()
				.employee(emp)
				.attDate(today)
				.checkIn(now)
				.attStatus(status)
				.build();
		
		// save
		Attendance saved = attendanceRepository.save(attendance);
			
		return AttendanceResponse.from(saved);
		
	}
	
	// 퇴근 check-out
	@Transactional
	public AttendanceResponse checkOut(Long empId) {
		
		// 금일 출근 기록 찾기
		LocalDate today = LocalDate.now();
		Attendance attendance = attendanceRepository
								.findByEmployee_EmpIdAndAttDate(empId, today)
								.orElseThrow(() -> new IllegalArgumentException("출근 기록이 없습니다."));
		
		// 이미 퇴근처리 되었는지 확인
		if(attendance.getCheckOut() != null) {
			throw new IllegalArgumentException("이미 퇴근 처리되었습니다.");
		}
		
		// 퇴근 시각 세팅
		attendance.setCheckOut(LocalDateTime.now());

		// ★ 근로시간 산출
		calculateWorkMinutes(attendance);

		return AttendanceResponse.from(attendance);

	}

	// 관리자 보정 쓰기 attId, AttendanceRequest AttendanceResponse
	@Transactional
	public AttendanceResponse editAtt(Long attId, AttendanceRequest request) {

		// 수정할 근태 기록 찾기(attId)
		Attendance attendance = attendanceRepository.findById(attId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 근태 기록입니다."));

		// request 시간으로 덮어쓰기
		attendance.setCheckIn(request.getCheckIn());
		attendance.setCheckOut(request.getCheckOut());

		// 근무시간 다시 계산하기
		calculateWorkMinutes(attendance);

		return AttendanceResponse.from(attendance);
	}
	
	private void calculateWorkMinutes(Attendance att) {
	    	    
		
	    // 1. 총 근무 시간 (check_out - check_in)
		LocalDateTime checkIn = att.getCheckIn();
	    LocalDateTime checkOut = att.getCheckOut();
	    
	    LocalDateTime standardStart = att.getAttDate().atTime(9, 0);
	    LocalDateTime standardEnd = att.getAttDate().atTime(18, 0);
	    
	    // 1-1. 근로 시작 전 출근 기록은 남기되 근무 시작은 09:00으로 보정해야함(근무시간 480분 준수)
	    if(checkIn.isBefore(standardStart)) { checkIn = standardStart; }
	    
	    long total = Duration.between(checkIn, checkOut).toMinutes();
	    
	    // 2. 휴게시간(12:00부터 13:00까지 60분, 정상 근무시) 차감
	    LocalDateTime breakStart = att.getAttDate().atTime(12, 0);
	    LocalDateTime breakEnd   = att.getAttDate().atTime(13, 0);
	    
	    LocalDateTime overlapStart = checkIn.isAfter(breakStart) ? checkIn : breakStart;
	    LocalDateTime overlapEnd   = checkOut.isBefore(breakEnd) ? checkOut : breakEnd;
	    
	    long breakOverlap = Math.max(0, Duration.between(overlapStart, overlapEnd).toMinutes());
	    
	    // 3. workMinutes 세팅
	    long workMinutes = (total - breakOverlap);

	    // 4. overtimeMinutes = max(0, workMinutes - 480) 연장 시간
	    long overtimeMinutes = Math.max(0, workMinutes - 480);

	    // 5. nightMinutes 야간 근무(연장) - 야간 근로수당 적용되는 시간 오후 10시~오전 6시
	    LocalDateTime nightStart = att.getAttDate().atTime(22, 0);
	    LocalDateTime nightEnd   = att.getAttDate().plusDays(1).atTime(6, 0);

	    LocalDateTime nightOverlapStart = checkIn.isAfter(nightStart) ? checkIn : nightStart;
	    LocalDateTime nightOverlapEnd   = checkOut.isBefore(nightEnd) ? checkOut : nightEnd;

	    long nightMinutes = Math.max(0, Duration.between(nightOverlapStart, nightOverlapEnd).toMinutes());
	    
	    // 6. att_status 보정 (18:00 전 퇴근이면 EARLY_LEAVE)
	    // 관리자가 시각 수정시 지각/조퇴 여부 다시 확인하기
	    if(checkIn.isAfter(standardStart)) {
	    	att.setAttStatus("LATE");
	    } else {
	    	att.setAttStatus("NORMAL");
	    }
	    	    
	    if(checkOut.isBefore(standardEnd) && !"LATE".equals(att.getAttStatus())) {
	    	att.setAttStatus("EARLY_LEAVE");
	    }
	    	    
	    // 7. Entity에 세팅 / long → int 캐스팅
	    att.setWorkMinutes((int)workMinutes);
	    att.setOvertimeMinutes((int)overtimeMinutes);
	    att.setNightMinutes((int)nightMinutes);

	}

}
