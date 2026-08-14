package com.sb.erp.global.oauth2;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CustomUserPrincipal implements UserDetails {
	private static final long serialVersionUID = 1L;

	private final Long empId; // jwt subject 유저
	private final Long comId;
	private final String empEmail;
	private final List<String> roles; // JWT의 "roles" 클레임(복수) 그대로 대응

	// JWT 사용자
	public CustomUserPrincipal(Long empId, Long comId, String empEmail, List<String> roles) {
		this.empId = empId;
		this.comId = comId;
		this.empEmail = empEmail;
		this.roles = (roles == null || roles.isEmpty())
				? Collections.emptyList()
				: roles;
	}
	
	@Override public String getPassword() { return "N/A"; }
	@Override public String getUsername() { return empEmail != null ? empEmail : String.valueOf(empId); }
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return roles.stream()
				.map(SimpleGrantedAuthority::new)
				.toList();
	}

	@Override public boolean isAccountNonExpired() { return true; }
	@Override public boolean isAccountNonLocked() { return true; }
	@Override public boolean isCredentialsNonExpired() { return true; }
	@Override public boolean isEnabled() { return true; }


	public Long getEmpId() { return empId; }
	public Long getComId() { return comId; }
	// 여러 권한을 가진 사원이 있을 수 있어 List로 반환
	public List<String> getRoles() { return roles; }
	// 단일 대표 권한이 필요한 곳(로그 등)을 위한 헬퍼 - 없으면 null
	public String getRole() { return roles.isEmpty() ? null : roles.get(0); }
}
