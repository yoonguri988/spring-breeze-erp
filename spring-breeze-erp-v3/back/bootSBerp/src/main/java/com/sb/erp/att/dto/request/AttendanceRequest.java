package com.sb.erp.att.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter @Getter 
public class AttendanceRequest {
	
	@NotNull
	private LocalDateTime checkIn;
	@NotNull
	private LocalDateTime checkOut;
	
}