# SBerp (spring-breeze-erp-v1)

> spring-breeze 팀의 전사적 자원 관리(ERP) 시스템

## 📌 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 프로젝트명 | SBerp (spring-breeze-erp-v1) |
| 팀명 | spring-breeze |
| 개발 기간 | 2025.06.11 ~ 2025.06.26 (16일) |
| 팀 인원 | 6명 |
| 도메인 | Enterprise Resource Planning |
| 모듈 수 | 8개 (결재 · 공지 · 자원 · 사원 · 프로젝트 · 회사 · 부서 · 권한) |
| 대상 사용자 | 중소 규모 기업 관리자 / 임직원 |

### 기획 의도
- **자원 통합**: 회사 · 부서 · 사원 · 자원 · 예약 · 프로젝트 · 결재 · 공지까지 흩어진 기업 데이터를 하나의 시스템에서 관리
- **권한 분리**: 로그인, 강제 비밀번호 재설정, 비밀번호 분실 본인확인 등 안전한 인증 흐름 설계
- **협업 강화**: 프로젝트 · 태스크 · 참여 사원 구조로 팀 단위 업무를 가시화하고 추적

## 🛠 기술 스택

**Frontend (View Layer)**
- JSP (server-side view)
- HTML5 / CSS3 / JavaScript
- Bootstrap 5
- jQuery (Ajax)

**Backend (Server Layer)**
- Java / Spring (MVC)
- MyBatis (ORM Mapper)
- Apache Tomcat
- Session 기반 인증

**DB & Tools**
- MySQL 8.4.9
- MyBatis Mapper XML
- Git / GitHub
- Figma (UI 설계)
- ERDCloud (ERD 설계)
- Lombok / Maven
- Notion (협업)

## 👥 팀원 역할 분담

| 담당자 | 모듈 | 담당 업무 | 상태 |
|---|---|---|---|
| **최윤정** (팀장) | company-department-authority | 회사 · 부서 관리, 로그인 · 권한 | ✅ shipped |
| 정수정 | employee | 사원 관리 · 중복 검사 (이메일, 모바일, 사번) | ✅ shipped |
| 김주엽 | approval-docs | 결재 문서 양식 관리 · CRUD | ✅ shipped |
| 최다영 | project-task | 프로젝트 / 태스크 관리 · 참여 사원 관리 | ✅ shipped |
| 장영탁 | resource | 자원 관리 CRUD · 자원 예약 관리 | ✅ shipped |
| 손창기 | notice | 공지 관리 · CRUD | 🔄 in-progress |

## 🗂 ERD (Entity Relationship Diagram)

회사(COMPANY)를 중심으로 통합된 ERP 모듈 구조로 설계되었습니다.

- **ORGANIZATION / HR**: `company`, `department`, `employee`, `emp_position`, `authority`, `emp_auth`
- **APPROVAL**: `appr_form`, `appr_doc`, `appr_line`
- **PROJECT / TASK**: `project`, `project_member`, `task`
- **RESOURCE & NOTICE**: `resource`, `reservation`, `notice`

모든 하위 모듈은 `company`(`com_id`)를 기준으로 연결되는 다중 회사(멀티 테넌시) 구조입니다.

## 🔄 시스템 워크플로우

```
[ LOGIN ] → [ AUTH / CONTEXT ] → [ ENTRY ] → [ 모듈별 CRUD ] → [ SERVICE_LAYER ] → [ DATABASE ]
```

1. **LOGIN**: 사번 / 비밀번호 입력
2. **AUTH**: 사용자 인증, 회사 / 부서 / 권한 확인
3. **ENTRY**: 메인 화면 진입
4. **MODULE**: 회사·부서 / 사원 / 전자결재 / 프로젝트·태스크 / 공지사항 / 자원·예약 중 선택
5. **SERVICE_LAYER**: 등록 / 조회 / 수정 / 삭제 (CRUD) 수행
6. **DATABASE**: DB 저장 및 실시간 상태 반영

### 로그인 인증 흐름
- 사번 · 비밀번호 일치 여부 확인 → 불일치 시 에러 페이지 표시
- 최초 로그인 또는 비밀번호 변경 필요 시 → 강제 비밀번호 재설정
- 인증 성공 시 세션 생성(empId 저장) → 권한 체크 후 관리자 / 사원 / PM 화면으로 라우팅

## 📦 모듈별 주요 기능

### 01. AUTH — 로그인 · 권한 (@최윤정)
- 로그인 처리 / 세션 발급, 로그인 실패 처리
- 최초 로그인 시 강제 비밀번호 재설정 (시스템 관리자 제외)
- 비밀번호 분실 시 사번 · 이메일 · 휴대폰번호 기반 본인확인 후 재설정

### 02. COMPANY · DEPARTMENT — 회사 · 부서 (@최윤정)
- 회사 CRUD, 사업자번호 중복 검사, 회사 검색 상위 5개 조회
- 부서 CRUD (1:N 트리 구조), 부서 상세 / 소속 사원 조회

### 03. EMPLOYEE — 사원 관리 (@정수정)
- 사원 CRUD, 상세 조회
- 이메일 / 모바일 / 사번 중복 검사 (Ajax 실시간 검증)
- 비밀번호 수정 · 초기화, 권한 수정

### 04. APPROVAL-DOCS — 결재 문서 양식 (@김주엽)
- 결재 양식 목록 조회, 등록 / 수정 / 삭제
- 양식 코드 유효성 검증 (`checkCode`)

### 05. PROJECT · TASK — 프로젝트 / 태스크 (@최다영)
- 프로젝트 CRUD, 상태 / 이름 / 기간별 조건 조회
- 태스크 CRUD, 프로젝트와 연계 관리
- 프로젝트 참여 사원(`project_member`) 추가 / 삭제 — N:M 매핑

### 06. NOTICE — 공지 관리 (@손창기, 진행 중)
- 공지사항 목록 조회 / 검색
- 공지 등록 / 상세 조회 / 수정 / 삭제

### 07. RESOURCE — 자원 / 예약 관리 (@장영탁)
- 자원 CRUD, 상세 조회
- 자원 예약 등록 / 수정, 예약 승인 · 반려 처리
- 자원 예약 목록 조회

## 📅 개발 일정 (16일)

| 단계 | 기간 | 내용 |
|---|---|---|
| Phase 1 | 06.11 ~ 06.15 (5일) | 기능 설계 — CRUD · ERD · Figma |
| Phase 2 | 06.15 ~ 06.20 | 파트별 개인 코딩 |
| Phase 3 | 06.18 ~ 06.22 | 1차 병합 · 보완 |
| Phase 4 | 06.21 ~ 06.22 | 최종 병합 · 테스트 |
| Phase 5 | 06.23 ~ 06.26 (4일) | 파이널 QA |

## ✅ 자체 평가

**잘한 점**
- 8개 모듈을 6명이 균등하게 분담
- 코딩 전 ERD · CRUD · 화면 설계 완료
- Git branch 전략으로 충돌 최소화
- 중복 검사 등 사용성 디테일 반영

**아쉬운 점**
- 1차 병합 시 의존 모듈 간 충돌 발생
- 공지 모듈 일정 지연 (in-progress)
- 권한 정책의 세분화 부족
- 통합 테스트 케이스 부족

**배운 점**
- ERD 우선 설계의 효과
- MyBatis 동적 SQL 활용
- JSP MVC 흐름 표준화
- Notion · GitHub 기반 협업 정착

**다음 개선 방향**
- Spring Boot 기반 리팩토링
- 본인 기능 외 다른 팀원 기능에 대한 교차 테스트 진행

## 📁 주요 설정 파일

- `web.xml` — `ContextLoaderListener`, `DispatcherServlet`, `springSecurityFilterChain`, 인코딩 필터 설정
- `root-context.xml` — DataSource(HikariCP), MyBatis `SqlSessionFactory`, MapperScanner 설정
- `servlet-context.xml` — MVC 어노테이션, ViewResolver(`/view/*.jsp`), 파일 업로드 리소스 매핑
- `security-context.xml` — Spring Security 인증/인가, BCrypt 암호화, 로그인 성공/실패 핸들러
- `mybatis-config.xml` — DTO Type Alias 및 MyBatis 공통 설정 (`mapUnderscoreToCamelCase`)

## 📄 라이선스

본 프로젝트는 spring-breeze 팀의 교육용 협업 프로젝트입니다.
