package com.sb.erp.dto;

import lombok.Data;

@Data
public class AuthDto {
	private int auth_id;
	private String user_id;
	private int dept_id;
	private String auth;
}

/*
-- ���� ���̺�
-- ���̺� ID / ����� ID / ���� ID / auth
create table authority(
auth_id int not null primary key auto_increment,
user_id varchar(50) not null,
dept_id int not null,
auth varchar(50) not null,
foreign key (user_id) references users(user_id),
foreign key (dept_id) references dept(dept_id)
);
*/