package com.sb.erp.dto;

import java.util.List;

import lombok.Data;

@Data
public class AuthUserDto {
	private String empEmail;
	private String empPass;
	private List<AuthDto> authList;
}
