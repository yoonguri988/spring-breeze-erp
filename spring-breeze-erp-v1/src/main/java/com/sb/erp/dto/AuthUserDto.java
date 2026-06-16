package com.sb.erp.dto;

import java.util.List;

import lombok.Data;

@Data
public class AuthUserDto {
	private String email;
	private String bpass;
	private List<AuthDto> authList;
}