package com.sb.erp.proj.dto.request;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProjRequest {
    private Long comId;
    private Long empId;
    private Long proId;
	private String proStatus;
	private String proName;
	private String proDesc;
	private LocalDate startDate;
	private LocalDate endDate;

}
/*	private Integer proId;
	private Integer comId;
	private Integer empId;
	private String proStatus;
	private String proName;
	private String proDesc;
	
	private LocalDate startDate;
	private LocalDate endDate;
	private LocalDate actualStartDate; //실제 착수일
	private LocalDate actualEndDate; //실제 완료일

	private LocalDate createdAt;
	private LocalDate updatedAt;
	
	private String empName;
	private Integer memberCnt; //프로젝트 멤버 인원 db값 존재하지않는 컬럼

	
	*/