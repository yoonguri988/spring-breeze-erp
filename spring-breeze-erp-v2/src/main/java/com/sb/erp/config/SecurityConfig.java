package com.sb.erp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	// http 경로 설정
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http//1. 허용경로
		    .authorizeHttpRequests(auth -> auth.requestMatchers("/auth/join","/auth/login","/auth/iddouble","/api/**","/**").permitAll()
		    		                           .requestMatchers("/auth/mypage","/auth/update","/auth/delete").authenticated()
		    		                           .anyRequest().permitAll()
		    		              )
		    //2. 로그인처리
		    .formLogin(form -> form.loginPage("/auth/login")
		    		               .loginProcessingUrl("/auth/loginProc")
		    		               .defaultSuccessUrl("/auth/mypage", true)
		    		               .failureUrl("/auth/fail")
		    		               .permitAll()
		    		  )
		    //3. 로그아웃
		    .logout(logout -> logout.logoutUrl("/auth/logout")
		    		                .logoutSuccessUrl("/auth/login")
		    		                .invalidateHttpSession(true)
		    		                .clearAuthentication(true)
		    		                .permitAll()
		    	   )
		    //4. csrf 예외처리
		    .csrf(csrf -> csrf.ignoringRequestMatchers("/auth/join", "/auth/update", "/auth/delete"));
		return http.build();
	}

	// AuthenticationManager 설정
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}
