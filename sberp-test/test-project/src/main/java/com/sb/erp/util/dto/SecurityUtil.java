package com.sb.erp.util.dto;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Swagger test stub - returns hardcoded values (no auth required)
 */
public class SecurityUtil {

    public static Long getCurrentComId() { return 1L; }

    public static Long getCurrentEmpId() { return 1L; }

    public static boolean isAdminOrRoot(Authentication auth) { return true; }

    public static boolean isAdmin() { return true; }

    public static void checkComIdAccess(Long targetComId) { /* no-op for test */ }
}
