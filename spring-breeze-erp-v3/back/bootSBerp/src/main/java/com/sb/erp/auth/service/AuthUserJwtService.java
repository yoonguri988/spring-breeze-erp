package com.sb.erp.auth.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.sb.erp.global.oauth2.CustomUserPrincipal;

@Component
public class AuthUserJwtService {
    public Long getCurrentEmpId(Authentication authentication) {
    	CustomUserPrincipal userPrincipal = (CustomUserPrincipal) authentication.getPrincipal();
        return userPrincipal.getEmpId();
    }
    
    public Long getCurrentComId(Authentication authentication) {
    	CustomUserPrincipal userPrincipal = (CustomUserPrincipal) authentication.getPrincipal();
    	return userPrincipal.getComId();
    }
 
    public String getCurrentEmpEmail(Authentication authentication) {
    	CustomUserPrincipal userPrincipal = (CustomUserPrincipal) authentication.getPrincipal();
        return userPrincipal.getUsername();
    }
    
    // 대표 권한 1개만 필요할 때 (여러 개 중 첫 번째)
    public String getCurrentRole(Authentication authentication) {
    	CustomUserPrincipal userPrincipal = (CustomUserPrincipal) authentication.getPrincipal();
    	return userPrincipal.getRole();
    }
 
    // 사원이 가진 모든 권한
    public List<String> getCurrentRoles(Authentication authentication) {
    	CustomUserPrincipal userPrincipal = (CustomUserPrincipal) authentication.getPrincipal();
    	return userPrincipal.getRoles();
    }
    
}
