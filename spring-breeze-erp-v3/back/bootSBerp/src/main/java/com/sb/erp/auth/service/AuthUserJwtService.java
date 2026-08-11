package com.sb.erp.auth.service;

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
    
    public String getCurrentRole(Authentication authentication) {
    	CustomUserPrincipal userPrincipal = (CustomUserPrincipal) authentication.getPrincipal();
    	return userPrincipal.getRole();
    }
    
}
