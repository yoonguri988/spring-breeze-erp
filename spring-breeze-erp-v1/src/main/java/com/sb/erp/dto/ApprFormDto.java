package com.sb.erp.dto;

import lombok.Data;

@Data
public class ApprFormDto {
	private int forId; // 테이블 id
	private int comId; // 회사 테이블 pk
	private String forCode; // 양식 코드명
	private String forTitle; // 양식 이름
	private String forContent; // 양식 본문
	private boolean forStatus; // 양식 사용 여부
	private String forCreated; // 양식 생성 일자
	private String forUpdated; // 양식 수정 일자
	
	private String comName; // 회사 이름
}

//-- 결재 양식 테이블
//create table  appr_form(
//for_id int not null primary key auto_increment,
//com_id int not null,
//for_code varchar(50) not null,
//for_title varchar(50) not null,
//for_content varchar(500) not null,
//for_status boolean not null,
//created_at datetime not null,
//updated_at datetime not null,
//foreign key (com_id) references 회사테이블(com_id)
//   on update cascade
//  on delete cascade
//);