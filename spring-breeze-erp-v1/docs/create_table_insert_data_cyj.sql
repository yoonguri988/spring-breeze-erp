drop table company;
drop table department;

create table company (
 companyId int primary key auto_increment,
 companyNm varchar(100) not null,
 bizNo varchar(20) unique, -- 사업자 번호 000-00-000000
 tel varchar(20),
 address varchar(255),
 logoUrl varchar(500),
 createdAt datetime not null default current_timestamp,
 updatedAt datetime not null default current_timestamp
);

desc company;

create table department (
	deptId int primary key auto_increment,
    companyId int not null,
    parentId int default null, -- null 최상위 부서
    deptNm varchar(100) not null,
    deptCd varchar(30),
    depth int default 0, -- 0 루트, 최대 5단계
    sortOrder int default 0,
    managerId int default null,
    createdAt datetime default current_timestamp,
    updatedAt datetime default current_timestamp
);

desc department;