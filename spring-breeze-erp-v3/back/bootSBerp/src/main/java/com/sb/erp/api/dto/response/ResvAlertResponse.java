package com.sb.erp.api.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResvAlertResponse {
	private long revId;        // 예약 PK
	private long resId;        // 자원 PK

	private String resCode;    // 자원 코드 (예: 차량번호로 활용)
	private String resName;    // 자원명 (예: 아반떼, 3층 대회의실)
	private String resType;    // ROOM / VEHICLE / EQUIPMENT

	private long empId;        // 신청자 사원 PK
	private String empName;    // 신청자 이름
	private String empMobile;  // 신청자 휴대폰 번호 (CoolSMS 발신 대상)

	private LocalDateTime startDt;
	private LocalDateTime endDt;
	private LocalDateTime returnDt;
}