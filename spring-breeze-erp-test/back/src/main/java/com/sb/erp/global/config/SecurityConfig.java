package com.sb.erp.global.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.sb.erp.global.security.JwtAuthenticationFilter;
import com.sb.erp.global.security.JwtProvider;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtProvider jwtProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, PasswordEncoder passEncoder) throws Exception {

        http
	        .csrf(csrf -> csrf.disable())
	        .formLogin(form -> form.disable())
	        .httpBasic(basic -> basic.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // 세션 설정
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 권한 설정
            .authorizeHttpRequests(auth -> auth
            	//Swagger 인증관련경로 권한 설정
            	.requestMatchers(
                "/auth/**", "/login/**",
                "/swagger-ui/**", "/v3/api-docs/**",
                "/swagger-resources/**", "/webjars/**", 
                "/configuration/**", "/uploads/**"  , "/api/deptusers/**" , "/api/likes/**",
                "/css/**", "/js/**", "/images/**"
                ).permitAll()
            	// TODO: 나중에 자기 영역 확인 후 채워 넣어야 함
                // ─── 정적 리소스 + 인증 관련 ───────────
//                .requestMatchers("/css/**", "/js/**", "/images/**",
//                        "/auth/login", "/auth/confirm",
//                        "/auth/resetPass", "/auth/forgotResetPass", "/auth/updatePass").permitAll()
                // JWT 발급 전용 로그인(외부/모바일)
//                .requestMatchers("/api/auth/login").permitAll()
                // ─── ROOT 전용 ────────────────────────
//                .requestMatchers("/root/**").hasAuthority("ROOT")
                // ─── ADMIN 이상 ───────────────────────
//                .requestMatchers("/admin/**").hasAnyAuthority("ROOT", "ROLE_ADMIN")
                // ─── 로그인만 하면 접근 가능 ───────────
//                .requestMatchers("/", "/emp/list", "/emp/detail", "/emp/edit",
//                        "/emp/editPass", "/com/**", "/dept/**", "/appr/**", "/res/**", "/resv/**",
//                        "/proj/**", "/notice/**", "/eval/report/detail", "/eval/report/my", "/report/**",
//                        "/upload/**").authenticated()
                // ─── 사원/직급/권한/평가 관리 (ADMIN 전용) ────
//                .requestMatchers("/emp/add", "/emp/resetPass", "/emp/checkEmail", "/emp/checkMobile",
//                        "/emp/checkEmpNo", "/perm/**", "/pos/**", "/dept/transfer/pending",
//                        "/dept/transfer/list", "/dept/transfer/log", "/eval/**").hasRole("ADMIN")
                // ─── 그 외 API: 세션 또는 JWT 둘 중 하나로 인증 ───
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
            )
            .exceptionHandling(ex -> ex.accessDeniedHandler((request, response, accessDeniedException) -> {
                request.getSession().setAttribute("accessDeniedMsg", "접근 권한이 없습니다.");
                response.sendRedirect(request.getContextPath() + "/");
            }))
            // 시큐리티 체인 안에서 동작
            .addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class);
        return http.build();
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