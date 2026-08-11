package com.sb.erp.global.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.sb.erp.global.oauth2.CustomUserPrincipal;
import com.sb.erp.global.security.JwtAuthenticationFilter;
import com.sb.erp.global.security.JwtProvider;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtProvider jwtProvider;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtProvider);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, PasswordEncoder passEncoder) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // ─── 정적 리소스 + 인증 관련 ───────────
                .requestMatchers("/css/**", "/js/**", "/images/**",
                        "/auth/login", "/auth/confirm",
                        "/auth/resetPass", "/auth/forgotResetPass", "/auth/updatePass").permitAll()
                // JWT 발급 전용 로그인(외부/모바일)
                .requestMatchers("/api/auth/login").permitAll()
                // ─── ROOT 전용 ────────────────────────
                .requestMatchers("/root/**").hasAuthority("ROOT")
                // ─── ADMIN 이상 ───────────────────────
                .requestMatchers("/admin/**").hasAnyAuthority("ROOT", "ROLE_ADMIN")
                // ─── 로그인만 하면 접근 가능 ───────────
                .requestMatchers("/", "/emp/list", "/emp/detail", "/emp/edit",
                        "/emp/editPass", "/com/**", "/dept/**", "/appr/**", "/res/**", "/resv/**",
                        "/proj/**", "/notice/**", "/eval/report/detail", "/eval/report/my", "/report/**",
                        "/upload/**").authenticated()
                // ─── 사원/직급/권한/평가 관리 (ADMIN 전용) ────
                .requestMatchers("/emp/add", "/emp/resetPass", "/emp/checkEmail", "/emp/checkMobile",
                        "/emp/checkEmpNo", "/perm/**", "/pos/**", "/dept/transfer/pending",
                        "/dept/transfer/list", "/dept/transfer/log", "/eval/**").hasRole("ADMIN")
                // ─── 그 외 API: 세션 또는 JWT 둘 중 하나로 인증 ───
                .requestMatchers("/api/**").authenticated()
            )
            .exceptionHandling(ex -> ex.accessDeniedHandler((request, response, accessDeniedException) -> {
                request.getSession().setAttribute("accessDeniedMsg", "접근 권한이 없습니다.");
                response.sendRedirect(request.getContextPath() + "/");
            }))
            .formLogin(form -> form.loginPage("/auth/login")
                    .loginProcessingUrl("/auth/login")
                    .successHandler(authenticationSuccessHandler(passEncoder))
                    .failureUrl("/auth/login?error")
                    .permitAll())
            .logout(logout -> logout.logoutUrl("/auth/logout")
                    .logoutSuccessUrl("/auth/login")
                    .invalidateHttpSession(true)
                    .clearAuthentication(true)
                    .permitAll())
            .csrf(csrf -> csrf.ignoringRequestMatchers("/auth/login", "/auth/update", "/auth/delete", "/api/**"))
            // 세션이 없는 외부/모바일 클라이언트는 Authorization 헤더(JWT)로 인증
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 로그인 성공 후 이동 경로 분기
    // - ROOT 권한: 비밀번호 그대로 사용 → 메인("/")
    // - 그 외: 최초 로그인(비밀번호 = 사번)이면 비밀번호 재설정 페이지로 강제 이동
    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler(PasswordEncoder passEncoder) {
        return (request, response, authentication) -> {
            CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();

            boolean isRoot = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROOT"));

            // 세션에 empId/comId 저장
            request.getSession().setAttribute("empId", principal.getEmpId());
            request.getSession().setAttribute("comId", principal.getComId());

            if (isRoot) {
                response.sendRedirect(request.getContextPath() + "/");
                return;
            }
            if (passEncoder.matches(principal.getEmpNo(), principal.getPassword())) {
                response.sendRedirect(request.getContextPath() + "/auth/resetPass");
                return;
            }
            response.sendRedirect(request.getContextPath() + "/");
        };
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost:8080", "http://52.79.175.214"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}