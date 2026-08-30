package com.sb.erp.att.dto.request;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter @Getter 
public class AttendanceRequest {
	

	private LocalDateTime checkIn; // 출근
	private LocalDateTime checkOut; // 퇴근
	private String attStatus; // 상태
	
	private Long empId; 
	private String empNo;
	private LocalDate attDate; // 근무일

}