package com.sb.erp.global.integration;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.sb.erp.proj.service.ProjectService;
import com.sb.erp.week.dto.response.*;
import com.sb.erp.api.dto.request.ResvAlertRequest;
import com.sb.erp.api.dto.response.ResvAlertResponse;
import com.sb.erp.resv.repository.ReservationMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class ApiScheduled {

	 /*///////CDY///////
    @Autowired private ProjectService projectService;
    @Autowired private ReportApi reportApi;
	
	@Scheduled(initialDelay = 10000, fixedDelay = Long.MAX_VALUE) 
	// initialDelay = 10000, fixedDelay = Long.MAX_VALUE 바로 테스트할거면 이거
	// cron = "0 0 9 * * MON"  매주 월요일 9시
	// https://docs.google.com/document/u/0/
	public void autoCreateWeeklyReports() {
        List<Integer> proIds = projectService.selectActiveProjectIds(); // status IN ('TODO','DOING')
        log.info("주간보고서 자동생성 대상: {}건", proIds.size());

        int success = 0, fail = 0;
        for (Integer proId : proIds) {
            try {
                WeeklyReportResponse dto = projectService.weeklyReport(Long.valueOf(proId));
                reportApi.createReport(dto);
                success++;
            } catch (Exception e) {
                log.error("주간보고서 생성 실패 - proId: {}", proId, e);
                fail++;
            }

            try {
                Thread.sleep(300); // API 쿼터 보호
            } catch (InterruptedException ignored) {}
        }

        log.info("주간보고서 자동생성 완료 - 성공:{} 실패:{}", success, fail);
    }
	///////CDY///////*/
	
	//// CYJ
	/*
	 * ///////////////////////////////////////////////////////////
	 * 자원 상태 체인징 & 노쇼 자동 경고 봇 (자원예약 모듈)
	 * ///////////////////////////////////////////////////////////
	 * - end_dt가 지났는데 return_dt가 비어있는 차량/장비 예약 (반납 지연)
	 * - start_dt는 지났지만 이용 흔적이 없는 회의실 예약 (노쇼 의심)
	 * 위 두 케이스를 스케줄러가 주기적으로 조회 -> ChatGPT로 맞춤 문구 생성 -> CoolSMS 발송
	 */
	
	@Autowired private ReservationMapper resDao;
	@Autowired private OpenAiReturnMsg apiReturnMsg;
	@Autowired private ApiCoolSms apiCoolSms;
	
	private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");
 
	/*
	 * ///////////////////////////////////////////////////////////
	 * 장비 예약 자동 미반납(NORET) 처리
	 * ///////////////////////////////////////////////////////////
	 * - 승인(APP)된 장비(EQUIPMENT) 예약 중, 종료일시(end_dt)가 지났는데 아직 반납(return_dt) 처리가
	 *   안 된 건을 상태 NORET(미반납)으로 전환한다.
	 * - AI/SMS 등 외부 유료 API를 호출하지 않는 순수 DB 배치라 노쇼 알림봇과 달리 기본 활성화한다.
	 */
	// 매시 정각 실행 (운영 부하를 고려해 주기 조정 가능)
	@Scheduled(cron = "0 0 * * * *", zone = "Asia/Seoul")
	public void autoMarkEquipmentNoReturn() {
		int updated = resDao.updateEquipmentNoReturn();
		if (updated > 0) {
			log.info("장비 예약 자동 미반납 처리 완료 - {}건 NORET 전환", updated);
		}
	}
	
	// 운영 시 트래픽/AI 호출 비용을 고려해 주기 조정 가능 (여기서는 1분마다)
	//@Scheduled(cron = "0 */1 * * * *", zone = "Asia/Seoul")
	public void noShowAutoAlert() {
		List<ResvAlertResponse> targets = resDao.selectNoShowTargets();
 
		if (targets.isEmpty()) {
			return;
		}
 
		log.info("노쇼/반납지연 알림 대상: {}건", targets.size());
 
		int success = 0, fail = 0;
 
		for (ResvAlertResponse dto : targets) {
			try {
				String message = buildAlertMessage(dto);
				apiCoolSms.sendMessage(dto.getEmpMobile(), message);
				resDao.updateAlertSent(dto.getRevId());
				success++;
			} catch (Exception e) {
				log.error("노쇼 알림 발송 실패 - revId: {}", dto.getRevId(), e);
				fail++;
			}
 
			try {
				Thread.sleep(300); // API 쿼터 보호
			} catch (InterruptedException ignored) {}
		}
 
		log.info("노쇼/반납지연 알림 발송 완료 - 성공:{} 실패:{}", success, fail);
	}
 
	/**
	 * ChatGPT에게 넘길 프롬프트를 구성하고, 실패 시를 대비한 fallback 문구도 함께 만든다.
	 */
	private String buildAlertMessage(ResvAlertResponse dto) {
		boolean isRoom = "ROOM".equals(dto.getResType());
 
		String systemPrompt =
				"너는 사내 ERP 시스템의 자원예약 담당 알림 봇이다. "
				+ "정중하지만 아주 간결한 한국어 알림 메시지를 한 문장으로 작성한다. "
				+ "문자메시지(SMS) 한 건 분량인 한글 40자 이내로 반드시 맞춘다. "
				+ "이모지, 인사말, 불필요한 수식어는 쓰지 않는다.";
 
		String userPrompt;
		String fallback;
 
		if (isRoom) {
			LocalDateTime startDt = dto.getStartDt();
			String startTime = startDt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
			userPrompt = String.format(
					"%s 님이 예약한 회의실 '%s'의 예약 시작 시간(%s)이 지났지만 이용 여부가 확인되지 않습니다. "
					+ "이용하지 않을 경우 다른 사람이 예약할 수 있도록 취소 처리를 요청하는 메시지를 작성해줘.",
					dto.getEmpName(), dto.getResName(), startTime);
 
			fallback = String.format(
					"%s님, 회의실 '%s' 예약(%s~) 이용 확인이 안 됩니다. 미이용시 취소 부탁드립니다.",
					dto.getEmpName(), dto.getResName(), startTime);
		} else {
			LocalDateTime endDt = dto.getEndDt();
			String endTime = endDt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
			String kindLabel = "EQUIPMENT".equals(dto.getResType()) ? "장비" : "차량";
 
			userPrompt = String.format(
					"%s 님이 예약한 %s '%s'(자원코드: %s)의 반납 예정 시간(%s)이 지났지만 반납 처리가 되지 않았습니다. "
					+ "다음 대기자를 위해 반납을 부탁하고, 연장이 필요하면 복귀 예정 시간을 알려달라는 메시지를 작성해줘.",
					dto.getEmpName(), kindLabel, dto.getResName(), dto.getResCode(), endTime);
 
			fallback = String.format(
					"%s님, %s '%s' 반납예정(%s) 초과. 반납 부탁드리며 연장시 복귀시간 알려주세요.",
					dto.getEmpName(), kindLabel, dto.getResName(), endTime);
		}
 
		return apiReturnMsg.generateMessage(systemPrompt, userPrompt, fallback);
	}
	
}
