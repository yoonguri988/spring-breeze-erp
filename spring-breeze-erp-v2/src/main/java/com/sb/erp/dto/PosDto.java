package com.sb.erp.dto;

import lombok.Data;

@Data
public class PosDto {
	
	private int posId; // 시스템 PK
	private String posCode; // 직급 코드: ceo, dir, mgr...
	private String posName; // 직급명: 회장, 이사, 부장...
	private int posOrder; // depth 순서 (0이 최상위)
	private int comId; // 회사 ID (FK) 예정
	
}
