package com.sb.erp.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.sb.erp.security.CustomUserDetails;

public class SecurityUtil {

	// 현재 로그인한 유저의 comId
	public static int getCurrentComId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated()) return 0;
		Object principal = auth.getPrincipal();
		if (principal instanceof CustomUserDetails) {
			return ((CustomUserDetails) principal).getUser().getComId();
		}
		return 0;
	}

	// 현재 로그인한 유저의 empId
	public static int getCurrentEmpId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated()) return 0;
		Object principal = auth.getPrincipal();
		if (principal instanceof CustomUserDetails) {
			return ((CustomUserDetails) principal).getUser().getEmpId();
		}
		return 0;
	}
}