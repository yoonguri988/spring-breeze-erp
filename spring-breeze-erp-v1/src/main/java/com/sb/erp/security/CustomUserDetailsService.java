package com.sb.erp.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class CustomUserDetailsService   implements UserDetailsService{
//	@Autowired UserMapper mapper;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//		AuthUserDto dto = mapper.readAuth(username); //email, bpass, auth(s)
//		return  dto == null? null : new CustomUser(dto);
		return null;
	}

}