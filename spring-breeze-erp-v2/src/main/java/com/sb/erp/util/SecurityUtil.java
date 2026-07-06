package com.sb.erp.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.sb.erp.security.CustomUserDetails;
import org.springframework.stereotype.Component;

public class SecurityUtil {

	// 현재 로그인한 유저의 comId
	public static int getCurrentComId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated())
			return 0;
		Object principal = auth.getPrincipal();
		if (principal instanceof CustomUserDetails) {
			return ((CustomUserDetails) principal).getUser().getComId();
		}
		return 0;
	}

	// 현재 로그인한 유저의 empId
	public static int getCurrentEmpId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated())
			return 0;
		Object principal = auth.getPrincipal();
		if (principal instanceof CustomUserDetails) {
			return ((CustomUserDetails) principal).getUser().getEmpId();
		}
		return 0;
	}

	// 현재 로그인 사용자가 ROOT 또는 ROLE_ADMIN 권한을 가졌는지 확인(보고 합치기)
	public static boolean isAdmin() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated()) { return false; }
		
		return auth.getAuthorities().stream().anyMatch(a -> {
			String role = a.getAuthority();
			return role.equals("ROOT") || role.equals("ROLE_ADMIN");
		});
	}

	public static boolean isAdminOrRoot(Authentication auth) {
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROOT")
                            || a.getAuthority().equals("ROLE_ADMIN"));
    }

}