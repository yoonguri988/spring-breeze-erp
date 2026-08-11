package com.sb.erp.auth.service;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.sb.erp.global.oauth2.CustomUserPrincipal;

@Component
public class AuthUserJwtService {
    // 현재 로그인한 유저의 empId
    public Long getCurrentEmpId(Authentication authentication) {
    	CustomUserPrincipal userPrincipal = (CustomUserPrincipal) authentication.getPrincipal();
        return userPrincipal.getEmpId();
    }
    // 현재 로그인한 유저의 comId
    public Long getCurrentComId(Authentication authentication) {
    	CustomUserPrincipal userPrincipal = (CustomUserPrincipal) authentication.getPrincipal();
    	return userPrincipal.getComId();
    }
 
    public String getCurrentEmpEmail(Authentication authentication) {
    	CustomUserPrincipal userPrincipal = (CustomUserPrincipal) authentication.getPrincipal();
        return userPrincipal.getUsername();
    }
    
    public String getCurrentRole(Authentication authentication) {
    	CustomUserPrincipal userPrincipal = (CustomUserPrincipal) authentication.getPrincipal();
    	return userPrincipal.getRole();
    }
    
    // 현재 로그인 사용자가 ROOT 또는 ROLE_ADMIN 권한을 가졌는지 확인
	public boolean isAdminOrRoot(Authentication auth) {
	    if (auth == null || !auth.isAuthenticated()) return false;
	    return auth.getAuthorities().stream()
	        .anyMatch(a -> a.getAuthority().equals("ROOT")
	                    || a.getAuthority().equals("ROLE_ADMIN"));
	}

	public boolean isAdmin() {
	    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	    return isAdminOrRoot(auth);
	}

    // 대상 데이터(targetComId)가 현재 로그인 유저의 회사와 같은지 검증.
	// 불일치 시 AccessDeniedException → GlobalExceptionHandler에서 403으로 매핑 예정.
	public static void checkComIdAccess(Long targetComId) {

	    Long currentComId = getCurrentComId();
	    if (targetComId == null || !targetComId.equals(currentComId)) {
	        throw new AccessDeniedException("접근 권한이 없습니다.");
	    }
	}
}
