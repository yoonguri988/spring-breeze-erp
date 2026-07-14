package com.sb.erp.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.sb.erp.dto.WeeklyReportDto;
import com.sb.erp.service.ProjectService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class ApiScheduled {

	/* ///////CDY///////
    @Autowired private ProjectService projectService;
    @Autowired private ReportApi reportApi;
	
	@Scheduled(cron = "0 0 9 * * MON") // 매주 월요일 9시
	// initialDelay = 10000, fixedDelay = Long.MAX_VALUE 바로 테스트할거면 이거
	// https://docs.google.com/document/u/0/
	public void autoCreateWeeklyReports() {
        List<Integer> proIds = projectService.selectActiveProjectIds(); // status IN ('TODO','DOING')
        log.info("주간보고서 자동생성 대상: {}건", proIds.size());

        int success = 0, fail = 0;
        for (Integer proId : proIds) {
            try {
                WeeklyReportDto dto = projectService.weeklyReport(proId);
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
	///////CDY/////// */
	
	
}
