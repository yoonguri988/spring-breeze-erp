package com.sb.erp.config;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * 비동기 이메일 발송 스레드 풀 + @Scheduled 활성화.
 * 기본 SimpleAsyncTaskExecutor는 요청마다 스레드를 새로 생성 → SMTP 폭주 위험
 * ThreadPoolTaskExecutor로 상한 걸어 안정화
 */

@Configuration
@EnableAsync
@EnableScheduling
public class AsyncConfig {

    /**
     * 메일 발송 전용 스레드 풀.
     * - core 5 / max 10 / queue 500
     * - 큐가 가득 차면 CallerRunsPolicy로 호출 스레드가 직접 실행 → 유실 방지
     * - @Async("mailExecutor") 로 지정해서 사용
     */
	
    @Bean(name = "mailExecutor")
    public Executor mailExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("MailAsync-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        executor.initialize();
        return executor;
    }
}
