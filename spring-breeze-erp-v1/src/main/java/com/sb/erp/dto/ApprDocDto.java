package com.sb.erp.dto;

import lombok.Data;

@Data
public class ApprDocDto {
	private int docId; // 문서 pk
	private int forId; // 양식 fk
	private int empId; // 사원 fk
	private int comId; // 회사 fk
	private String docTitle; // 문서 이름
	private String docContent; // 문서 본문
	private String docStatus; // 문서 상태 (대기,반려,승인)
	private String docCreated; // 문서 작성 일시
	private String docUpdated; // 문서 수정 일시
	
	private String docName; // 사원 이름 -> 사원 fk에서 가져와야함
}

//-- 결재 문서 테이블
//create table appr_doc(
//doc_id int not null primary key auto_increment,
//for_id int not null,
//dep_id int not null, << 부서테이블이나 사원테이블 둘중하나 사원테이블이 맞을것같음
//com_id int not null,
//doc_title varchar(50) not null,
//doc_content varchar(500) not null,
//doc_status varchar(20) not null default 'WAI',
//doc_name varchar(30) not null,  << 부서 테이블에서 가져올수 있을것같으면 제외
//foreign key (form_id) references appr_form(form_id),
//foreign key (dept_id) references 부서테이블(dept_id),
//foreign key (com_id) references 회사테이블(com_id)
//	on update cascade
//  on delete cascade
//);
