package com.sb.erp.global.oauth2;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CustomUserPrincipal implements UserDetails {
	private static final long serialVersionUID = 1L;

	private final Long empId; // jwt subject 유저
	private final Long comId;
	private final String empEmail;
	private final String role;

	// JWT 사용자
	public CustomUserPrincipal(Long empId, Long comId, String empEmail, String role) {
		this.empId = empId;
		this.comId = comId;
		this.empEmail = empEmail;
		this.role = role;
	}
	
	@Override public String getPassword() { return "N/A"; }
	@Override public String getUsername() { return empEmail != null ? empEmail : String.valueOf(empId); }
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority(role));
	}

	@Override public boolean isAccountNonExpired() { return true; }
	@Override public boolean isAccountNonLocked() { return true; }
	@Override public boolean isCredentialsNonExpired() { return true; }
	@Override public boolean isEnabled() { return true; }


	public Long getEmpId() { return empId; }
	public Long getComId() { return comId; }
	public String getRole() { return role; }


}
