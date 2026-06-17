package com.sb.erp.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.sb.erp.dao.AuthMapper;
import com.sb.erp.dto.AuthUserDto;

public class CustomUserDetailsService   implements UserDetailsService{
	@Autowired AuthMapper mapper;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		AuthUserDto dto = mapper.readAuth(username);
		return  dto == null? null : new CustomUser(dto);
	}

}
