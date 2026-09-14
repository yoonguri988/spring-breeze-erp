# 🏢 SBerp (spring-breeze-erp-v1)

spring-breeze 팀이 만든 **전사적 자원관리(ERP) 시스템**입니다.
흩어져 있는 회사·부서·사원·자원·프로젝트·결재·공지 데이터를 하나의 시스템에서 통합 관리하는 것을 목표로 했습니다.

---

## 1. 프로젝트 개요

**SBerp**는 중소 규모 기업의 관리자·임직원을 대상으로 한 사내 통합 관리 시스템입니다.
회사와 부서를 중심으로 사원, 프로젝트/태스크, 전자결재, 자원/예약, 공지사항까지 흩어져 있던 업무를 하나의 시스템 안에서 처리할 수 있도록 설계했습니다.

- **프로젝트 성격**: 팀 프로젝트 (6인, 신규 구축)
- **도메인**: Enterprise Resource Planning (ERP)
- **대상 사용자**: 중소 규모 기업의 관리자 / 임직원
- **모듈 수**: 8개 (로그인·권한 / 회사·부서 / 사원 / 전자결재 / 프로젝트·태스크 / 자원·예약 / 공지)

### 기획 의도

- **자원 통합**: 회사 · 부서 · 사원 · 자원 · 예약 · 프로젝트 · 결재 · 공지까지 흩어진 기업 데이터를 하나의 시스템에서 관리
- **권한 분리**: 로그인, 최초 로그인 시 강제 비밀번호 재설정, 비밀번호 분실 시 본인확인 등 안전한 인증 흐름 설계
- **협업 강화**: 프로젝트 · 태스크 · 참여 사원 구조로 팀 단위 업무를 가시화하고 추적

---

## 2. 기간 / 인원

- **개발 기간**: 2025.06.11 ~ 2025.06.26 (16일)
- **팀 인원**: 6명 (spring-breeze 팀)

| 단계 | 기간 | 내용 |
|---|---|---|
| Phase 1 | 06.11 ~ 06.15 (5일) | 기능 설계 — CRUD · ERD · Figma |
| Phase 2 | 06.15 ~ 06.20 | 파트별 개인 코딩 |
| Phase 3 | 06.18 ~ 06.22 | 1차 병합 · 보완 |
| Phase 4 | 06.21 ~ 06.22 | 최종 병합 · 테스트 |
| Phase 5 | 06.23 ~ 06.26 (4일) | 팀 자체 QA |

---

## 3. 기술 스택

### Backend

![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/Spring%20MVC-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![MyBatis](https://img.shields.io/badge/MyBatis-000000?style=for-the-badge&logoColor=white)
![Apache Tomcat](https://img.shields.io/badge/Apache%20Tomcat-F8DC75?style=for-the-badge&logo=apachetomcat&logoColor=black)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)
![Lombok](https://img.shields.io/badge/Lombok-BC0031?style=for-the-badge&logoColor=white)

### Database

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

### Frontend (View Layer)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000000)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)
![JSP](https://img.shields.io/badge/JSP-437291?style=for-the-badge&logoColor=white)

### Collaboration / Tools

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)

---

## 4. 시스템 구조

### ERD (Entity Relationship Diagram)

회사(`COMPANY`)를 중심으로 통합된 ERP 모듈 구조로 설계했습니다. 모든 하위 모듈은 `com_id`를 기준으로 연결되는 **다중 회사(멀티 테넌시) 구조**입니다.

- **ORGANIZATION / HR**: `company`, `department`, `employee`, `emp_position`, `authority`, `emp_auth`
- **APPROVAL**: `appr_form`, `appr_doc`, `appr_line`
- **PROJECT / TASK**: `project`, `project_member`, `task`
- **RESOURCE & NOTICE**: `resource`, `reservation`, `notice`

![alt text](https://github.com/yoonguri988/spring-breeze-erp/blob/a856fcbc285986ae1da2064a2bd175015dfaea28/spring-breeze-erp-v1/docs/img/SBerpV1_ERD_img.PNG)

### 시스템 워크플로우

```
[ LOGIN ] → [ AUTH / CONTEXT ] → [ ENTRY ] → [ 모듈별 CRUD ] → [ SERVICE_LAYER ] → [ DATABASE ]
```

1. **LOGIN**: 사번 / 비밀번호 입력
2. **AUTH**: 사용자 인증, 회사 / 부서 / 권한 확인
3. **ENTRY**: 메인 화면 진입
4. **MODULE**: 회사·부서 / 사원 / 전자결재 / 프로젝트·태스크 / 공지사항 / 자원·예약 중 선택
5. **SERVICE_LAYER**: 등록 / 조회 / 수정 / 삭제 (CRUD) 수행
6. **DATABASE**: DB 저장 및 실시간 상태 반영

**로그인 인증 흐름**
- 사번 · 비밀번호 일치 여부 확인 → 불일치 시 에러 페이지 표시
- 최초 로그인 또는 비밀번호 변경 필요 시 → 강제 비밀번호 재설정 (시스템 관리자 제외)
- 인증 성공 시 세션 생성(empId 저장) → 권한 체크 후 관리자 / 사원 / PM 화면으로 라우팅
- 비밀번호 분실 시 사번 · 이메일 · 휴대폰번호 기반 본인확인 후 재설정

![alt text](https://github.com/yoonguri988/spring-breeze-erp/blob/6a8df1ae5f4744695964fa9612749bbdc9c95193/spring-breeze-erp-v1/docs/img/SBerpV1_Login_Flow_img.PNG)

---

## 5. 주요 기능

- 회사 · 부서 CRUD 및 조직도 조회 (사업자번호 중복 검사, 회사 검색 상위 5개 조회 포함)
- 로그인 / 세션 발급, 최초 로그인 강제 비밀번호 재설정, 비밀번호 분실 시 본인확인 후 재설정
- 사원 CRUD 및 상세 조회, 이메일 · 모바일 · 사번 실시간 중복 검사(Ajax), 비밀번호 수정 · 초기화, 권한 수정
- 전자결재 문서 양식 CRUD, 양식 코드 유효성 검증
- 프로젝트 · 태스크 CRUD, 상태 / 이름 / 기간별 조건 조회, 프로젝트 참여 사원(N:M) 추가 · 삭제
- 자원 CRUD 및 상세 조회, 자원 예약 등록 · 수정, 예약 승인 · 반려 처리
- 공지사항 목록 조회 · 검색, 등록 · 상세 조회 · 수정 · 삭제
- 회사(`com_id`) 기준 멀티 테넌시 구조로 여러 회사 데이터 분리 관리

---

## 6. 담당 업무 및 성과

8개 모듈을 6명이 균등하게 분담했습니다.

### 01. 최윤정 (팀장) — `company-department-authority`

**담당**: 회사 · 부서 관리, 로그인 · 권한

- 회사 CRUD, 사업자번호 중복 검사, 회사 검색 상위 5개 조회
- 부서 CRUD (1:N 트리 구조), 부서 상세 / 소속 사원 · 조직도 조회
- 로그인 처리 · 세션 발급, 최초 로그인 시 강제 비밀번호 재설정(시스템 관리자 제외)
- 비밀번호 분실 시 사번 · 이메일 · 휴대폰번호 기반 본인확인 후 재설정
- **성과**: 팀장으로서 역할 분배와 전체 일정을 조율하고, 인증 · 조직 기반 기능을 먼저 완성해 다른 팀원들이 막히지 않고 개발할 수 있는 기반을 마련

| 로그인 | 회사 관리 | 조직도(부서) |
|:---:|:---:|:---:|
| ![로그인](https://raw.githubusercontent.com/yoonguri988/spring-breeze-erp/6a8df1ae5f4744695964fa9612749bbdc9c95193/spring-breeze-erp-v1/docs/img/cyj/login.PNG) | ![회사 관리](https://raw.githubusercontent.com/yoonguri988/spring-breeze-erp/6a8df1ae5f4744695964fa9612749bbdc9c95193/spring-breeze-erp-v1/docs/img/cyj/company.PNG) | ![조직도](https://raw.githubusercontent.com/yoonguri988/spring-breeze-erp/6a8df1ae5f4744695964fa9612749bbdc9c95193/spring-breeze-erp-v1/docs/img/cyj/department.PNG) |


### 02. 정수정 — `employee`

**담당**: 사원 관리 · 중복 검사

- 사원 CRUD, 상세 조회
- 이메일 / 모바일 / 사번 중복 검사 (Ajax 실시간 검증)
- 비밀번호 수정 · 초기화, 권한 수정
- **성과**: 정확한 사원 데이터 기준을 세우고, 가입 · 정보 수정 단계에서의 중복 데이터를 사전에 차단해 데이터 정합성 확보

| 사원 관리 | 사원 등록 |
|:---:|:---:|
| ![사원관리](https://github.com/yoonguri988/spring-breeze-erp/blob/5781b128b4e075078e39a3b83b10a44caa2cac53/spring-breeze-erp-v1/docs/img/jsj/employee.PNG) | ![사원 등록](https://github.com/yoonguri988/spring-breeze-erp/blob/5781b128b4e075078e39a3b83b10a44caa2cac53/spring-breeze-erp-v1/docs/img/jsj/employee.PNG) |

### 03. 김주엽 — `approval-docs`

**담당**: 결재 문서 양식 관리

- 결재 양식 목록 조회, 등록 / 수정 / 삭제
- 양식 코드 유효성 검증 (`checkCode`)
- **성과**: 전자결재 양식 체계를 표준화해 이후 결재 문서 확장 시 재사용 가능한 구조를 마련

| 결재문서양식 관리 | 결재문서양식 등록 |
|:---:|:---:|
| ![결재문서양식관리](https://github.com/yoonguri988/spring-breeze-erp/blob/5781b128b4e075078e39a3b83b10a44caa2cac53/spring-breeze-erp-v1/docs/img/kjy/apprDoc.PNG) | ![결재문서양식등록](https://github.com/yoonguri988/spring-breeze-erp/blob/5781b128b4e075078e39a3b83b10a44caa2cac53/spring-breeze-erp-v1/docs/img/kjy/apprDoc_create.PNG) |

### 04. 최다영 — `project-task`

**담당**: 프로젝트 / 태스크 관리 · 참여 사원 관리

- 프로젝트 CRUD, 상태 / 이름 / 기간별 조건 조회
- 태스크 CRUD, 프로젝트와 연계 관리
- 프로젝트 참여 사원(`project_member`) 추가 / 삭제 — N:M 매핑
- **성과**: 프로젝트 · 태스크 · 참여 사원 구조로 팀 단위 업무를 가시화하고 진행 상태를 추적할 수 있도록 구현

| 프로젝트관리 | 프로젝트멤버관리 | 태스크관리 |
|:---:|:---:|:---:|
| ![프로젝트관리](https://raw.githubusercontent.com/yoonguri988/spring-breeze-erp/6a8df1ae5f4744695964fa9612749bbdc9c95193/spring-breeze-erp-v1/docs/img/cyj/login.PNG) | ![프로젝트멤버관리](https://raw.githubusercontent.com/yoonguri988/spring-breeze-erp/6a8df1ae5f4744695964fa9612749bbdc9c95193/spring-breeze-erp-v1/docs/img/cyj/company.PNG) | ![태스크관리](https://raw.githubusercontent.com/yoonguri988/spring-breeze-erp/6a8df1ae5f4744695964fa9612749bbdc9c95193/spring-breeze-erp-v1/docs/img/cyj/department.PNG) |

### 05. 장영탁 — `resource`

**담당**: 자원 관리 CRUD · 자원 예약 관리

- 자원 CRUD, 상세 조회
- 자원 예약 등록 / 수정, 예약 승인 · 반려 처리
- 자원 예약 목록 조회
- **성과**: 자원 운영 흐름(등록 → 예약 → 승인/반려)을 시스템으로 옮겨 오프라인으로 관리되던 사내 자원 현황을 실시간으로 확인할 수 있게 함

| 자원관리 | 자원예약관리 |
|:---:|:---:|
| ![자원관리](https://raw.githubusercontent.com/yoonguri988/spring-breeze-erp/6a8df1ae5f4744695964fa9612749bbdc9c95193/spring-breeze-erp-v1/docs/img/kjy/apprDoc.PNG) | ![자원예약관리](https://raw.githubusercontent.com/yoonguri988/spring-breeze-erp/6a8df1ae5f4744695964fa9612749bbdc9c95193/spring-breeze-erp-v1/docs/img/kjy/apprDoc_create.PNG) |

### 06. 손창기 — `notice`

**담당**: 공지 관리 · CRUD

- 공지사항 목록 조회 / 검색
- 공지 등록 / 상세 조회 / 수정 / 삭제
- **성과**: 전사 공지 흐름을 한곳에 모아 카테고리별로 관리할 수 있는 구조 마련 (일정상 세부 기능은 1차 시연 시점 기준 in-progress)

| 공지관리 |
|:---:|
| ![공지관리](https://raw.githubusercontent.com/yoonguri988/spring-breeze-erp/6a8df1ae5f4744695964fa9612749bbdc9c95193/spring-breeze-erp-v1/docs/img/kjy/apprDoc.PNG) |


### ▶️ 파트별 시연 영상

| 담당자 | 모듈 | 영상 |
|---|---|---|
| 최윤정 | company-department-authority | [시연 영상](https://youtu.be/nybOKBw8DDE) |
| 정수정 | employee | [시연 영상](https://youtu.be/hoh_qZ7mNgg) |
| 김주엽 | approval-docs | [시연 영상](https://youtu.be/JktFg-zR71I) |
| 최다영 | project-task | [시연 영상](https://www.youtube.com/watch?v=Hn5SBf0oBY8) |
| 장영탁 | resource | [시연 영상](https://www.youtube.com/watch?v=oojCM-uTIkw) |
| 손창기 | notice | [시연 영상](https://youtu.be/mioIWbvvV_w) |

---

## 7. 트러블슈팅

### 사례 1. Git 협업 충돌 (1차 병합)

**문제**
- 6명이 각자 파트를 개발한 뒤 1차 병합 시 여러 모듈 코드가 동시에 충돌

**원인**
- 신규 개발자를 포함한 팀원 다수가 Git 브랜치 전략 · 협업 워크플로우에 익숙하지 않은 상태로 개인 파트를 병렬 개발

**해결**
- Phase 3(1차 병합 · 보완) 구간을 별도로 두어 충돌 지점을 팀 단위로 함께 점검
- 이후 브랜치 전략을 정리해 최종 병합(Phase 4) 시 충돌을 최소화

**성과**
- 8개 모듈, 6명 분담임에도 최종 병합 · 테스트를 1~2일 내에 완료

**학습**
- 신규 개발자가 포함된 팀일수록 Git 브랜치 전략을 프로젝트 초반에 합의해야 병합 리스크를 줄일 수 있음을 체득

### 사례 2. 통합 테스트 케이스 부족

**문제**
- 개인 파트 단위 테스트는 진행했지만, 모듈 간 연계(예: 회사 삭제 시 부서 · 사원 데이터 영향) 통합 테스트 케이스가 부족

**원인**
- 16일이라는 짧은 개발 기간에 기능 구현을 우선하다 보니 상호 모듈 간 교차 테스트, 대량 데이터 기준 페이징 테스트에 상대적으로 시간을 적게 투입

**해결**
- 팀 자체 QA(Phase 5) 기간에 삭제 · 수정 시 연관 데이터 영향도를 확인하는 확인 팝업(예: 부서 삭제 시 소속 사원 존재 여부 경고) 등 안전장치를 우선 보완

**성과 / 학습**
- 다음 프로젝트에서는 본인 기능 외 다른 팀원의 기능까지 교차 테스트하고, 테이블당 1,000건 이상의 대량 데이터 기준 페이징 테스트를 진행하기로 개선 방향을 수립

---

## 8. 자체 평가

**잘한 점**
- 8개 모듈을 6명이 균등하게 분담
- 코딩 전 ERD · CRUD · 화면 설계 완료
- Git branch 전략으로 충돌 최소화
- 중복 검사 등 사용성 디테일 반영

**아쉬운 점**
- 1차 병합 시 Git 협업 방식에 익숙하지 않아 충돌 발생
- 공지 모듈 일정 지연 (in-progress)
- 통합 테스트 케이스 부족 (테이블당 최소 1,000건 이상 필요)
- 전체 시스템 플로우에 대한 팀원 간 인지 부족

**배운 점**
- ERD 우선 설계의 효과
- MyBatis 동적 SQL 활용
- JSP MVC 흐름 표준화
- Notion · GitHub · Discord 기반 협업 정착

**다음 개선 방향**
- Spring Boot + Oracle + Thymeleaf 기반 리팩토링
- 본인 기능 외 다른 팀원 기능에 대한 교차 테스트 진행
- 전체 시스템 플로우에 대한 팀 공통 인지 강화
- 일정 지연 방지를 위한 브랜치별 조기 push 습관화

---

## 9. 팀 회고

> 16일간의 협업, 6명의 목소리

**@최윤정 (company-department-authority, 팀장)**
> 팀장으로서 역할 분배와 전체 일정을 조율했습니다. 기능들을 먼저 완성해 다른 팀원들이 막히지 않고 개발할 수 있게 했습니다. 다음엔 더 많은 테스트 데이터를 만들어 페이징 테스트도 진행하고, 발생하는 다양한 오류에 대해 점검해보고 싶습니다.

**@정수정 (employee)**
> 첫 프로젝트에 임하며, 메서드를 나누고 코드 흐름을 다듬는 일이 생각보다 더 어려웠습니다. 기능은 구현했지만 구조와 사용자 경험 측면에서 보완할 부분이 많이 남아있고요. 이번 프로젝트를 토대로 계획을 다시 검토해서, 다음에는 완성도를 더 높이겠습니다.

**@김주엽 (approval-docs)**
> 첫 팀프로젝트라 기능 구현에만 급급해 디테일한 부분을 놓친 것 같아 아쉽습니다. 다음 프로젝트에서는 기능의 완성도뿐 아니라 디테일한 부분까지 챙기고, 팀원들의 코드를 공유하며 협업하고 싶습니다.

**@최다영 (project-task)**
> 프로젝트를 진행하면서 팀원들과의 소통과 협업의 중요성을 다시 한번 느꼈습니다. 다음 프로젝트에서는 더 효율적인 일정 관리와 적극적인 의견 공유를 통해 더욱 완성도 높은 결과를 만들고 싶습니다.

**@장영탁 (resource)**
> 제가 맡은 자원 관리와 자원 예약 관리 기능은 기본적인 흐름은 잘 구현했지만, 예약 충돌 처리나 예외 상황 대응 같은 세부 로직은 더 보완할 부분이 있다고 느꼈습니다. 앞으로는 실제 사용 상황을 더 고려해 기능의 완성도를 높이고 싶습니다.

**@손창기 (notice)**
> 신규 개발자로서 첫 팀플이라 일정 안에 결과를 내기에 어려움이 있어 업데이트가 늦었습니다. 다음 팀플에서는 일정에 지연되지 않도록 일찍 PR을 올려 팀 피드백을 받는 흐름을 만들고 싶습니다.

---

## 10. 주요 설정 파일

- `web.xml` — `ContextLoaderListener`, `DispatcherServlet`, `springSecurityFilterChain`, 인코딩 필터 설정
- `root-context.xml` — DataSource(HikariCP), MyBatis `SqlSessionFactory`, MapperScanner 설정
- `servlet-context.xml` — MVC 어노테이션, ViewResolver(`/view/*.jsp`), 파일 업로드 리소스 매핑
- `security-context.xml` — Spring Security 인증/인가, BCrypt 암호화, 로그인 성공/실패 핸들러
- `mybatis-config.xml` — DTO Type Alias 및 MyBatis 공통 설정 (`mapUnderscoreToCamelCase`)

---

## 📄 라이선스

본 프로젝트는 spring-breeze 팀의 교육용 협업 프로젝트입니다.
