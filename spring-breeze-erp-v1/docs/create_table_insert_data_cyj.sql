create database erp_db;

use erp_db;

create table company (
 companyId int primary key auto_increment,
 companyNm varchar(100) not null,
 bizNo varchar(20) unique, -- 사업자 번호 000-00-000000
 tel varchar(20),
 address varchar(255),
 logoUrl varchar(500),
 createdAt datetime not null default current_timestamp,
 updatedAt datetime not null default current_timestamp,
 isActive int not null default 1
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
    updatedAt datetime default current_timestamp,
    isActive int default 1
);

desc department;

-- 임시 데이터 company (5개)
INSERT INTO company (companyId, companyNm, bizNo, tel, address, logoUrl, createdAt, isActive) VALUES
(1, '한국테크솔루션',   '123-45-67890', '02-1234-5678', '서울시 강남구 테헤란로 123',      NULL, '2020-03-15 09:00:00', 1),
(2, '스마트비즈코리아', '234-56-78901', '031-234-5678', '경기도 성남시 분당구 판교로 456',  NULL, '2019-07-22 09:00:00', 1),
(3, '글로벌이노베이션', '345-67-89012', '02-3456-7890', '서울시 서초구 강남대로 789',       NULL, '2018-01-10 09:00:00', 1),
(4, '디지털퓨처스',     '456-78-90123', '051-456-7890', '부산시 해운대구 센텀로 101',       NULL, '2021-05-30 09:00:00', 1),
(5, '넥스트웨이브',     '567-89-01234', '02-5678-9012', '서울시 마포구 월드컵북로 202',     NULL, '2022-11-01 09:00:00', 1);

-- 임시 데이터 department (30개)
INSERT INTO department (deptId, companyId, parentId, deptName, deptCode, depth, sortOrder, managerId, createdAt, isActive) VALUES
-- depth 0: 회사 루트
(1,  1, NULL, '한국테크솔루션',   'KTS',      0, 1, NULL, '2020-03-15 09:00:00', 1),
(2,  2, NULL, '스마트비즈코리아', 'SBK',      0, 1, NULL, '2019-07-22 09:00:00', 1),

-- depth 1: 본부 — company 1
(3,  1, 1,    '경영지원본부',     'KTS-MGT',  1, 1, NULL, '2020-03-15 09:00:00', 1),
(4,  1, 1,    '개발본부',         'KTS-DEV',  1, 2, NULL, '2020-03-15 09:00:00', 1),
(5,  1, 1,    '영업본부',         'KTS-SAL',  1, 3, NULL, '2020-03-15 09:00:00', 1),

-- depth 1: 본부 — company 2
(6,  2, 2,    '경영지원본부',     'SBK-MGT',  1, 1, NULL, '2019-07-22 09:00:00', 1),
(7,  2, 2,    '기술본부',         'SBK-TEC',  1, 2, NULL, '2019-07-22 09:00:00', 1),
(8,  2, 2,    '마케팅본부',       'SBK-MKT',  1, 3, NULL, '2019-07-22 09:00:00', 1),

-- depth 2: 팀 — company 1 경영지원본부
(9,  1, 3,    '인사팀',           'KTS-HR',   2, 1, NULL, '2020-04-01 09:00:00', 1),
(10, 1, 3,    '재무팀',           'KTS-FIN',  2, 2, NULL, '2020-04-01 09:00:00', 1),
(11, 1, 3,    '총무팀',           'KTS-GEN',  2, 3, NULL, '2020-04-01 09:00:00', 1),

-- depth 2: 팀 — company 1 개발본부
(12, 1, 4,    '백엔드개발팀',     'KTS-BE',   2, 1, NULL, '2020-04-01 09:00:00', 1),
(13, 1, 4,    '프론트개발팀',     'KTS-FE',   2, 2, NULL, '2020-04-01 09:00:00', 1),
(14, 1, 4,    'QA팀',             'KTS-QA',   2, 3, NULL, '2020-04-01 09:00:00', 1),

-- depth 2: 팀 — company 1 영업본부
(15, 1, 5,    '국내영업팀',       'KTS-DOM',  2, 1, NULL, '2020-04-01 09:00:00', 1),
(16, 1, 5,    '해외영업팀',       'KTS-OVS',  2, 2, NULL, '2020-04-01 09:00:00', 1),
(17, 1, 5,    '영업지원팀',       'KTS-SUP',  2, 3, NULL, '2020-04-01 09:00:00', 1),

-- depth 2: 팀 — company 2 경영지원본부
(18, 2, 6,    '인사팀',           'SBK-HR',   2, 1, NULL, '2019-08-01 09:00:00', 1),
(19, 2, 6,    '재무팀',           'SBK-FIN',  2, 2, NULL, '2019-08-01 09:00:00', 1),
(20, 2, 6,    '법무팀',           'SBK-LEG',  2, 3, NULL, '2019-08-01 09:00:00', 1),

-- depth 2: 팀 — company 2 기술본부
(21, 2, 7,    '서버개발팀',       'SBK-SRV',  2, 1, NULL, '2019-08-01 09:00:00', 1),
(22, 2, 7,    '앱개발팀',         'SBK-APP',  2, 2, NULL, '2019-08-01 09:00:00', 1),
(23, 2, 7,    '인프라팀',         'SBK-INF',  2, 3, NULL, '2019-08-01 09:00:00', 1),

-- depth 2: 팀 — company 2 마케팅본부
(24, 2, 8,    '브랜드마케팅팀',   'SBK-BRD',  2, 1, NULL, '2019-08-01 09:00:00', 1),
(25, 2, 8,    '디지털마케팅팀',   'SBK-DIG',  2, 2, NULL, '2019-08-01 09:00:00', 1),

-- depth 3: 파트 — company 1 개발팀 하위
(26, 1, 12,   'Spring파트',       'KTS-BE-SP', 3, 1, NULL, '2021-01-10 09:00:00', 1),
(27, 1, 12,   'DevOps파트',       'KTS-BE-DO', 3, 2, NULL, '2021-01-10 09:00:00', 1),
(28, 1, 13,   'React파트',        'KTS-FE-RE', 3, 1, NULL, '2021-06-01 09:00:00', 1),
(29, 1, 13,   'iOS파트',          'KTS-FE-IO', 3, 2, NULL, '2022-03-15 09:00:00', 1),

-- depth 3: 파트 — company 2
(30, 2, 22,   'Android파트',      'SBK-APP-AN',3, 1, NULL, '2020-09-01 09:00:00', 1);


select * from company;
select * from department;