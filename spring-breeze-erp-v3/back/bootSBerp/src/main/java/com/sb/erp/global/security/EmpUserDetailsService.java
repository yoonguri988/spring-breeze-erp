package com.sb.erp.global.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.sb.erp.auth.dto.response.AuthUserResponse;
import com.sb.erp.auth.repository.AuthMapper;
import com.sb.erp.global.oauth2.CustomUserPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmpUserDetailsService implements UserDetailsService {

    private final AuthMapper authMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AuthUserResponse dto = authMapper.readAuth(username);
        if (dto == null) {
            throw new UsernameNotFoundException("존재하지 않는 계정: " + username);
        }
        return new CustomUserPrincipal(dto);
    }
}