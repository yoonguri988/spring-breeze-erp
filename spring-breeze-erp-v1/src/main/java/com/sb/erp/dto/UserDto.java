package com.sb.erp.dto;

import lombok.Data;

@Data
public class UserDto {
	private String user_id;
	private String user_pass;
	private String user_email;
}


/*
-- 사용자 테이블
-- 사용자 ID / 비밀번호 / 이메일 
create table users(
user_id varchar(50) not null primary key,
user_pass varchar(500) not null,
user_email varchar(50) not null
);
*/