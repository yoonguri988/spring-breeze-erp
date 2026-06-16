# 전사적 자원 관리 (ERP) 및 협업 B2B SaaS

## 통합 기업 경영(ERP) 및 실시간 협업 웹 플랫폼 구현

### 프로젝트 소개

한 줄 설명 — "Java 풀스택 팀이 만든 통합 ERP 시스템"<br/>
프로젝트 배경·목적 — 왜 만들었는지, 어떤 문제를 해결하는지 2~3문장<br/>
주요 기능 목록 — 전자결재·조직도·프로젝트 관리 등 6~7개 기능 bullet<br/>

### 팀원 및 역할 분담

(표형태로 이름/역할/담당기능정리)<br/>
공통 작업(DB 설계, 인증) 별도 명시 추천<br/>

### 실행 방법

(예시)Prerequisites — Java 버전, Node 버전 등 요구사항<br/>
설치 & 실행 명령어 — git clone → 환경변수 설정 → 빌드 → 실행 순서<br/>
application.yml 설정 항목 설명 (DB 연결, JWT 시크릿 등)<br/>

---

## sql
---
### 테이블
---
#### 직급
+-----------+-------------+------+-----+---------+----------------+
| Field     | Type        | Null | Key | Default | Extra          |
+-----------+-------------+------+-----+---------+----------------+
| pos_id    | int         | NO   | PRI | NULL    | auto_increment |
| pos_code  | varchar(20) | NO   |     | NULL    |                |
| pos_name  | varchar(20) | NO   |     | NULL    |                |
| pos_order | int         | NO   |     | NULL    |                |
| com_id    | int         | NO   |     | NULL    |                |
+-----------+-------------+------+-----+---------+----------------+
5 rows in set (0.00 sec)

---
#### 사원
+------------+--------------+------+-----+-------------------+-----------------------------------------------+
| Field      | Type         | Null | Key | Default           | Extra                                         |
+------------+--------------+------+-----+-------------------+-----------------------------------------------+
| emp_id     | int          | NO   | PRI | NULL              | auto_increment                                |
| emp_no     | varchar(20)  | NO   |     | NULL              |                                               |
| emp_name   | varchar(50)  | NO   | UNI | NULL              |                                               |
| emp_pass   | varchar(500) | NO   |     | NULL              |                                               |
| emp_email  | varchar(100) | NO   | UNI | NULL              |                                               |
| emp_mobile | varchar(20)  | NO   |     | NULL              |                                               |
| emp_status | varchar(10)  | YES  |     | 재직              |                                               |
| hire_date  | date         | YES  |     | NULL              |                                               |
| created_at | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED                             |
| updated_at | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
| dept_id    | int          | NO   |     | NULL              |                                               |
| pos_id     | int          | NO   |     | NULL              |                                               |
| com_id     | int          | NO   |     | NULL              |                                               |
+------------+--------------+------+-----+-------------------+-----------------------------------------------+
13 rows in set (0.00 sec)

