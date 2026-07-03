package com.sb.erp.util;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {
    public static boolean isAdminOrRoot(Authentication auth) {
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROOT")
                            || a.getAuthority().equals("ROLE_ADMIN"));
    }
}