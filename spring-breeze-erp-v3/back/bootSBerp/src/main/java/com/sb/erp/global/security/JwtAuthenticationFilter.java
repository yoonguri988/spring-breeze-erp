package com.sb.erp.global.security;
import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.sb.erp.global.oauth2.CustomUserPrincipal;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

//보안게이트
/**
 * JWT 인증필터
 * - Authorization 헤더에서 Bearer 토큰추출
 * - JwtProvider로 Claims파싱
 * - CustomUserPincipal 기반   Pincipal 생성후 SecurityContext에 저장
 * */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	//JWT 토큰 발급/검증
    private final JwtProvider jwtProvider;

    public JwtAuthenticationFilter(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }
    
    // /upload/ 로 시작하는 요청은 JWT 필터 타지 않게 통과
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/upload/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
            	logger.debug("====== [Filter] 추출된 토큰: " + token);
                Claims claims = jwtProvider.parse(token).getBody();  
                // subject  →  empId, comId, empEmail, role
                Long empId = Long.parseLong(claims.getSubject());
                Long comId = claims.get("comId", Long.class);
                String empEmail = claims.get("empEmail", String.class);
                String role = claims.get("role", String.class);
                
	             //CustomUserPincipal
                CustomUserPrincipal userPrincipal = new CustomUserPrincipal(empId, comId, empEmail, role);

                 UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userPrincipal, null, userPrincipal.getAuthorities()
                 );

                 SecurityContextHolder.getContext().setAuthentication(auth);
 
                 logger.debug("====== [Filter] SecurityContext에 인증 정보 저장 완료! ======");
            } catch (Exception e) {
            	//토큰파싱, 검증시 에러나는지 확인
            	System.out.println("에러 원인: " + e.getMessage());
                e.printStackTrace(); 
                
                SecurityContextHolder.clearContext();
            }
        } else { 
        	logger.debug("  [Filter] Authorization 헤더가 누락되었거나 Bearer 형식이 아닙니다.");
        }

        chain.doFilter(request, response);
    }
}