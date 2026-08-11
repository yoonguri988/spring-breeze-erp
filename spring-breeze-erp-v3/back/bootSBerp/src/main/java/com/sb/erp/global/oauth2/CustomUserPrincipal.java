package com.sb.erp.global.oauth2;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.sb.erp.auth.dto.response.AuthResponse;
import com.sb.erp.auth.dto.response.AuthUserResponse;

import lombok.Getter;


/**
 * 인증 Principal
 * - 세션 로그인: AuthUserDto (DB 조회 1회, 사원정보+권한목록 포함)
 * - JWT 인증: empId/comId/role (claim만, DB 재조회 없음 — stateless)
 */
@Getter
public class CustomUserPrincipal implements UserDetails {
 
    private static final long serialVersionUID = 1L;
    
    private final Long empId;
    private final Long comId;
    private final Long deptId;
    private final Long posId;
    private final String empEmail;
    private final String empNo;
    private final String password;              // BCrypt 해시. 응답으로 직접 노출 금지
    
    private final List<GrantedAuthority> authorities;
    // 1) 세션 로그인용 — CustomUserDetailsService에서 생성
    public CustomUserPrincipal(AuthUserResponse user) {
        this.empId = user.getEmpId();
        this.comId = user.getComId();
        this.deptId = user.getDeptId();
        this.posId = user.getPosId();
        this.empEmail = user.getEmpEmail();
        this.empNo = user.getEmpNo();
        this.password = user.getEmpPass();
        this.authorities = buildAuthorities(user.getAuthList());
    }
    
 // 2) JWT 인증용 — JwtAuthenticationFilter에서 생성 (매 요청 stateless)
    public CustomUserPrincipal(Long empId, Long comId, String role) {
        this.empId = empId;
        this.comId = comId;
        this.deptId = null;
        this.posId = null;
        this.empEmail = null;
        this.empNo = null;
        this.password = "N/A";
        this.authorities = List.of(new SimpleGrantedAuthority(role));
    }

    private static List<GrantedAuthority> buildAuthorities(List<AuthResponse> authList) {
        if (authList == null || authList.isEmpty()) {
            return List.of(new SimpleGrantedAuthority("ROLE_MEMBER")); // 권한 없으면 기본값
        }
        return authList.stream()
                .filter(a -> a.getAutName() != null && !a.getAutName().isBlank())
                .map(a -> new SimpleGrantedAuthority(a.getAutName()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() { return "N/A"; }     //비밀번호 불일치

    public String getUsername() { return empEmail != null ? empEmail : String.valueOf(empId); }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
 
}