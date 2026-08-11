package com.sb.erp.emp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.emp.service.MailSchedulerService;

import lombok.RequiredArgsConstructor;

/**
 * 관리자 수동 이메일 배치 트리거.
 * 실무 관례: 새벽 스케줄러 실패 시 관리자가 수동으로 재실행할 수 있게 열어둠</li>
 * ROOT/ADMIN만 접근 가능
 * 
 * curl 테스트:
 * curl -X POST http://localhost:8080/api/admin/mail/trigger-followup-3day
 * curl -X POST http://localhost:8080/api/admin/mail/trigger-welcome-orphans

 * 두 엔드포인트 모두 즉시 200을 반환한다. 실제 발송은 {@code @Async} 스레드에서
 * 진행되므로, 결과는 email_send_log 테이블(status: P/S/F)로 확인할 것.
 */
@RestController
@RequestMapping("/api/admin/mail")
@RequiredArgsConstructor
public class AdminMailController {

    private final MailSchedulerService mailSchedulerService;

    @PreAuthorize("hasAuthority('ROOT') or hasRole('ADMIN')")
    @PostMapping("/trigger-followup-3day")
    public ResponseEntity<String> triggerFollowup3Day() {
        mailSchedulerService.triggerFollowup3Day();
        return ResponseEntity.ok("3일 차 안부 메일 배치를 수동 실행했습니다.");
    }

    @PreAuthorize("hasAuthority('ROOT') or hasRole('ADMIN')")
    @PostMapping("/trigger-welcome-orphans")
    public ResponseEntity<String> triggerWelcomeOrphans() {
        mailSchedulerService.triggerWelcomeOrphans();
        return ResponseEntity.ok("환영 메일 안전망 배치를 수동 실행했습니다.");
    }
}
