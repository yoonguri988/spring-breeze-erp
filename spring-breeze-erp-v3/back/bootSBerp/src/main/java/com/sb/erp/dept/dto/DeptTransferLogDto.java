package com.sb.erp.dept.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.sb.erp.api.dto.AiRecomDto;
import com.sb.erp.appr.dto.ApprDocImpactDto;
import com.sb.erp.appr.dto.ApprLineImpactDto;
import com.sb.erp.dept.dto.DeptDto.DeptResponseDto;
import com.sb.erp.emp.dto.EmpTransferDto;
import com.sb.erp.emp.dto.EmployeeTransferItemForm;
import com.sb.erp.resv.dto.ResvImpactDto;

import lombok.Getter;
import lombok.Setter;

public class DeptTransferLogDto {
	
	// 부서 이관 로그 등록/수정 - 요청 DTO
	@Setter @Getter
	public static class DeptTransferLogRequestDto {
		// 목록/이력 검색 조건
		private Integer originDeptId;   // 원부서
        private Integer targetDeptId;   // 대상부서
        private String aiRecommended;   // ai 제안여부 ("Y" | "N" | null=전체)
        private String dateFrom;        // 처리시작일자
        private String dateTo;          // 처리종료일자

        // 페이지네이션
        private int pstartno = 1;
        private int onepagelist = 10;
        
        // 부서이동 실행 요청
        private Integer deptId;         // 현재 조회 중인 부서
        private Integer comId;          // 회사

        private String returnUrl;                       // 처리 후 리다이렉트 URL
        private List<EmployeeTransferItemForm> items;    // 이동 대상 사원 목록
        
        /** 화면 로드 시점에 조회했던 AI 추천 사유 — dept_transfer_log.ai_reason 에 감사 기록 */
        private String aiReason;

        /** 화면 로드 시점의 결재문서 제목 요약 — dept_transfer_log.handover_snapshot 에 감사 기록 */
        private String snapshotText;
	}
	
	// 부서 이관 로그 정보 - 응답 DTO
	@Getter
	public static class DeptTransferLogResponseDto {
		// 로그 단건 응답
        private Long logId;
        private Integer comId;
        private Integer originDeptId;
        private String originDeptName;   // 화면 표시용 (join 결과)
        private Integer targetDeptId;
        private String targetDeptName;   // 화면 표시용 (join 결과)
        private Integer empId;
        private String empName;          // 화면 표시용 (join 결과)
        private String aiRecommended;    // "Y" | "N"
        private String aiReason;
        private String handoverSnapshot;
        private Integer createdBy;
        private String createdByName;    // 화면 표시용 (join 결과)
        private LocalDateTime createdAt;
		
        // 이동 전 영향도 미리보기 응답
        private Integer deptId;
        private String deptName;
        private String deptCode;

        private List<EmpTransferDto> employees;       // 이관 대상 사원
        private List<ResvImpactDto> reservations;     // 사원 기준 미처리(WAIT) 예약
        private List<ApprLineImpactDto> apprLines;    // 사원 기준 미완료 결재라인
        private List<ApprDocImpactDto> apprDocs;      // 사원이 기안한 진행중 결재문서
        private String snapshotText;                  // 진행중 결재문서 제목 요약
        private List<DeptResponseDto> candidates;     // 부서 후보들
        private AiRecomDto aiRecom;                   // 부서 추천 AI 내용
        
        public int getEmployeeCount() {
            return employees == null ? 0 : employees.size();
        }

        public int getReservationCount() {
            return reservations == null ? 0 : reservations.size();
        }

        public int getApprLineCount() {
            return apprLines == null ? 0 : apprLines.size();
        }

        public int getApprDocCount() {
            return apprDocs == null ? 0 : apprDocs.size();
        }
	}
}
