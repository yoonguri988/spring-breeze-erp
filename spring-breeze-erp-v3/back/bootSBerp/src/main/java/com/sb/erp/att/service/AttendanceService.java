package com.sb.erp.att.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
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
	
	
	//	목록 조회	읽기	startDate, endDate, start, end	List<AttendanceResponse>
	public List<AttendanceResponse> getAllAttendances(LocalDate startDate, LocalDate endDate, int start, int end){
		return attendanceRepository.findAttendanceWithPaging(startDate, endDate, start, end)
				.stream()
				.map(AttendanceResponse::from)
				.collect(Collectors.toList());
	}
	
	//	본인 조회	읽기	empId	List<AttendanceResponse>
	public List<AttendanceResponse> getAttendanceByEmpId(Long empId){
		return attendanceRepository.findByEmployee_EmpId(empId)
				.stream()
				.map(AttendanceResponse::from)
				.collect(Collectors.toList());
	}
	
	//	check-in	쓰기	empId (JWT)	AttendanceResponse
	@Transactional
	public AttendanceResponse checkIn(Long empId) {
		
		// 오늘 날짜로 이미 출근처리 되었는지 확인
		LocalDate today = LocalDate.now();
		long count = attendanceRepository.countByEmployee_EmpIdAndAttDate(empId, today);
		if(count > 0) {
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
	
	//	check-out	쓰기	empId (JWT)	AttendanceResponse
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
		
		// ★ 근로시간 산출 로직 구현하고 추가하기
		// 여기에... calculateWorkMinutes
		
		return AttendanceResponse.from(attendance);
		
	}
	
	//	관리자 보정	쓰기	attId, AttendanceRequest	AttendanceResponse
	@Transactional
	public AttendanceResponse editAtt(Long attId, AttendanceRequest request) {
		
		// 수정할 근태 기록 찾기(attId)
		Attendance attendance = attendanceRepository.findById(attId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 근태 기록입니다."));
		
		// request 시간으로 덮어쓰기
		attendance.setCheckIn(request.getCheckIn());
		attendance.setCheckOut(request.getCheckOut());
		
		// 근무시간 다시 계산하기
		// calculateWorkMinutes
		
		return AttendanceResponse.from(attendance);
	}

}
