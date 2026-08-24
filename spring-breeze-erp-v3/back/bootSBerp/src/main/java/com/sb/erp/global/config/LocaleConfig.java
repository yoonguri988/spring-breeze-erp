package com.sb.erp.global.config;

import java.util.Locale;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;

/**
 * 프론트엔드가 이미 설정하고 있는 sberp_lang 쿠키("ko" / "en")를 읽어서
 * 요청 스레드의 Locale(LocaleContextHolder)을 결정한다.
 *
 * DispatcherServlet이 요청마다 이 LocaleResolver를 통해 LocaleContextHolder를
 * 자동으로 세팅해주므로, 별도 Filter/Interceptor 없이도
 * - GlobalExceptionHandler에서 MessageSource.getMessage(..., LocaleContextHolder.getLocale())
 * - Bean Validation(@NotBlank(message = "{key}") 등, spring-boot-starter-validation의
 *   LocalValidatorFactoryBean이 애플리케이션 MessageSource를 자동으로 사용)
 * 양쪽 모두 같은 로케일을 참조하게 된다.
 *
 * 쿠키가 없거나 값이 ko/en이 아닌 경우 기본 로케일(한국어)로 동작한다.
 */
@Configuration
public class LocaleConfig {

    public static final String LANG_COOKIE_NAME = "sberp_lang";

    @Bean
    public LocaleResolver localeResolver() {
        CookieLocaleResolver resolver = new CookieLocaleResolver();
        resolver.setCookieName(LANG_COOKIE_NAME);
        resolver.setDefaultLocale(Locale.KOREAN);
        // 쿠키 값이 "ko"/"en"처럼 지역(country) 없이 언어만 담긴 형태이므로
        // BCP47 언어 태그가 아닌 Locale.toString() 스타일 파싱을 사용한다.
        resolver.setLanguageTagCompliant(false);
        return resolver;
    }
}
