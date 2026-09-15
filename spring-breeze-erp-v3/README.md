# 🏢 SBerp v3 (spring-breeze-erp-v3)

spring-breeze 팀이 2차 ERP를 Spring Boot 4 · JPA · JWT · React/Next.js 스택으로 전면 재구축한 **HR 중심 통합 ERP 시스템**입니다.<br/>
사원 등록 → 근태 기록 → 연차 차감 → 인사평가 → 급여로 이어지는 데이터 흐름이 끊기지 않는 것을 목표로, 근태 · 연차 · 평가 · 급여 · 채용 도메인을 새로 추가했습니다.

---

## 1. 프로젝트 개요

**SBerp v3**는 2차 ERP(spring-breeze-erp-v2)의 기술 스택과 인증 방식을 전면 재구축하면서, **인사 · 근태 · 연차 · 평가 · 급여 · 채용을 하나의 데이터 흐름으로 연결**한 3차 프로젝트입니다.<br/>
"사원 한 명의 데이터가 끊김 없이 모든 도메인에 흐르게 만드는 것"을 목표로, 근태 기록이 인사평가 요약에 반영되고 연차 승인이 근태 데이터를 갱신하며 근태 · 평가 결과가 급여 산정으로 이어지는 구조를 설계했습니다.

- **프로젝트 성격**: 팀 프로젝트 (4인, 2차 ERP 리팩토링 + 신규 기능 개발, 3차 시연 프로젝트)
- **도메인**: HR 중심 ERP (인사 · 근태 · 연차 · 평가 · 급여 · 전자결재 · 채용)
- **대상 사용자**: 중소 규모 기업의 관리자 / 임직원 / 채용 지원자
- **모듈 수**: 20개 이상 (회사 · 부서 / 인증 · 권한 / 사원 · 직급 / 근태 · 연차 / 인사평가 / 급여 / 전자결재 / 프로젝트 · 태스크 / 자원 · 예약 / 공지 / 채용 · 지원자 · 이력서)
- **신규 기능**: 근태 · 연차 · 급여 · 채용 도메인 신규 개발, HR/급여 규정 AI 챗봇(RAG) 파이프라인 구축, 관리자 · 사원 · 지원자 대시보드 신규

### 기획 의도

- **REAL**: 엑셀 수식 재계산, 4대보험 대비 연차수당 불만, 계정 탈취 우려 등 실제 업무에서 반복되는 불편을 급여 산정 엔진 · RAG Q&A · 인증 강화로 직접 해결
- **COMPLEX**: 급여 항목 간 계산 순서 의존성, 연차 차감과 결재 승인의 트랜잭션 정합성, 규정 문서 근거 판정 등 여러 도메인이 얽힌 규칙을 구조적으로 정리
- **FULLSTACK**: 2차의 세션 인증 · Thymeleaf SSR · MyBatis 단독 구조를 JWT + Redis 인증, React/Next.js SSR, JPA + MyBatis 하이브리드로 전면 재구축

---

## 2. 기간 / 인원

- **개발 기간**: 2026.08.01 ~ 2026.08.28 (28일)
- **팀 인원**: 4명 (spring-breeze 팀, 3차 프로젝트)

| 단계 | 기간 | 내용 |
|---|---|---|
| 리팩토링 | 08.01 ~ 08.10 | Thymeleaf SSR → React/Next.js 전환, MyBatis 단독 → JPA 하이브리드 구성, 세션 인증 → JWT + Redis 전환 |
| 신규 기능 개발 | 08.11 ~ 08.21 | 근태 · 연차 · 급여 · 채용 신규 개발, HR/급여 RAG 챗봇 파이프라인 구축, 관리자 · 사원 대시보드 신규 |
| 검증 · 시연 준비 | 08.22 ~ 08.28 | 전체 코드 리뷰 및 디버깅, 멀티테넌시(com_id) 격리 점검, 통합 테스트 · 리허설 · 시연 준비 |

---

## 3. 기술 스택

### Backend

![Java](https://img.shields.io/badge/Java%2017-007396?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot%204.0.7-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![JPA](https://img.shields.io/badge/JPA%20(Hibernate)-59666C?style=for-the-badge&logo=hibernate&logoColor=white)
![MyBatis](https://img.shields.io/badge/MyBatis-000000?style=for-the-badge&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white)
![Lombok](https://img.shields.io/badge/Lombok-BC0031?style=for-the-badge&logoColor=white)

### Frontend (View Layer)

![React](https://img.shields.io/badge/React%2017-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js%2012%20(SSR)-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant%20Design%204-0170FE?style=for-the-badge&logo=antdesign&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Redux Saga](https://img.shields.io/badge/Redux--Saga-999999?style=for-the-badge&logo=redux-saga&logoColor=white)

### Database

![Oracle](https://img.shields.io/badge/Oracle%2018c%20XE-F80000?style=for-the-badge&logo=oracle&logoColor=white)
![Redis](https://img.shields.io/badge/Redis%20(Refresh%20Token)-DC382D?style=for-the-badge&logo=redis&logoColor=white)

### External API / AI

![OpenAI](https://img.shields.io/badge/OpenAI%20GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)
![Embeddings](https://img.shields.io/badge/OpenAI%20Embeddings-412991?style=for-the-badge&logo=openai&logoColor=white)
![PDFBox](https://img.shields.io/badge/Apache%20PDFBox-D22128?style=for-the-badge&logo=apache&logoColor=white)
![Naver OCR](https://img.shields.io/badge/Naver%20CLOVA%20OCR-03C75A?style=for-the-badge&logo=naver&logoColor=white)
![CoolSMS](https://img.shields.io/badge/CoolSMS-FF6600?style=for-the-badge&logoColor=white)

### Collaboration / Tools

![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)

---

## 4. 시스템 구조

### ERD (Entity Relationship Diagram)

2차의 회사(`company`) 중심 구조를 유지하면서, 조직 · 기준정보를 중심으로 근태 · 연차 · 평가 · 급여 · 규정 도메인을 새로 연결했습니다. 모든 도메인은 `com_id` 기준 **멀티테넌시 구조**를 유지합니다.

- **ORGANIZATION / HR**: `company`, `department`, `employee`, `emp_position`, `authority`, `emp_auth`
- **ATTENDANCE / LEAVE**: `attendance`, `leave_balance`, `leave_grant`
- **EVALUATION / SALARY**: `eval_report`, `salary_payment` (+ `SalaryItemCalculator` 구현체 기반 산정 근거)
- **HR 규정 (RAG)**: `hr_plcy_doc` → `hr_plcy_chunk` (조항 단위 청킹 · 임베딩)
- **APPROVAL**: `appr_form`, `appr_doc`, `appr_line`
- **RECRUITMENT**: `applicant`, `resume`(rsm), `notice`(rec)
- **PROJECT / TASK / RESOURCE**: `project`, `project_member`, `task`, `resource`, `reservation`

![인사파트중심ERD](https://github.com/yoonguri988/spring-breeze-erp/blob/e2b42be818c21f89bb46ee4654869a434f36b5b1/spring-breeze-erp-v3/docs/imgs/SBerpV3_ERD.PNG)

### 시스템 워크플로우 (Layered Architecture)

```
[ LOGIN ] → [ JWT 발급 / Redis Refresh Token ] → [ React/Next.js SSR 라우팅 ] → [ 도메인별 API ] → [ JPA + MyBatis 하이브리드 SERVICE_LAYER ] → [ Oracle 18c XE ]
```

1. **LOGIN**: 이메일 · 비밀번호 로그인
2. **AUTH**: Spring Security가 인증 처리, AccessToken 발급 및 RefreshToken을 Redis에 저장(TTL 2시간)
3. **ROUTING**: React 17 + Next.js 12 SSR 라우팅, 역할(관리자 / 사원 / 지원자)별 화면 분기
4. **MODULE**: 근태 · 연차 · 평가 · 급여 · 전자결재 · 채용 · 자원 · 예약 · 프로젝트 · 태스크 · 공지 중 선택
5. **SERVICE_LAYER**: JPA(엔티티 중심 CRUD) + MyBatis(통계 · 리포트성 복잡 쿼리) 하이브리드 처리
6. **DATABASE**: Oracle 18c XE 저장, Redis로 RefreshToken · 캐시 관리

**인증 흐름**
- 이메일 · 비밀번호 일치 여부 확인 → 15분 내 5회 이상 실패 시 계정 잠금(무차별 대입 공격 방어)
- 비밀번호 정책: 8자 이상, 영문 · 숫자 · 특수문자 등 3종 조합 이상
- 인증 성공 시 AccessToken 발급(만료 15분) + RefreshToken을 Redis에 저장(절대 만료 2시간, 활동 여부와 무관)
- 로그인 이력 저장에 실패해도 인증 흐름 자체는 예외를 던지지 않고 계속 진행

**HR/급여 규정 AI 챗봇 RAG 파이프라인 (6단계)**
```
PDF 업로드 → 조항(제n조) 단위 청킹 → 임베딩 → 코사인 유사도 계산 → 근거 판정 → 답변 생성 및 이력 저장
```
- 근거 조항을 하나도 찾지 못하면 GPT API 자체를 호출하지 않고 고정 안내문으로 응답(비용 · 환각을 함께 차단)
- 유사도 필터는 절대 임계값이 아닌 "상위 1위 점수 대비 상대적 격차" 기준으로 판정(자세한 내용은 7. 트러블슈팅 참고)

---

## 5. 주요 기능

- **급여 산정 엔진**: `SalaryItemCalculator` 인터페이스 기반 계산기 구현체를 Spring `List`로 주입해 조합, 계산 근거를 문자열로 저장
- **급여 규정 AI Q&A(RAG)**: 사내 급여 규정을 조항 단위로 청킹 · 임베딩하고 질문과 유사한 조항만 근거로 답변, VectorDB 없이 애플리케이션 레이어에서 코사인 유사도 계산
- **인증 · 계정 보안**: JWT + Redis 기반 인증, 계정 잠금(15분 내 5회 실패), 비밀번호 정책(8자 이상 · 3종 조합)
- **근태 반영 AI 평가 리포트**: 부서장 코멘트와 동기간 근태 통계를 함께 넘겨 사원별 평가 요약문 생성, GPT 응답 검증 실패 시 Mock 리포트로 자동 대체
- **관리자 대시보드**: 근태 · 연차 잔여 · 전사 출근 현황 · 결재 대기 · 진행 중 프로젝트 등 6개 도메인을 API 1회 호출로 집계
- **HR 규정 AI 챗봇(RAG)**: 근태 · 연차 · 복리후생 등 사내 규정 조항 기반으로만 답변, 근거 없으면 API 호출 자체를 차단
- **연차 신청 ↔ 결재 연동**: 승인 즉시 `leave_request` 상태 · `leave_balance` 사용일수 · `attendance` 연차/반차 행을 3개 테이블 동시 갱신
- **결재선 위임 · 대결**: 대기 중인 결재선에 한해 다른 사원을 대결자로 지정, 본인 지정 불가 · 중복 지정 불가 · 중복 요청 불가의 3중 차단
- **사원 대시보드**: 결재 대기 건수, 본인 기안 건수를 한눈에 확인
- **AI 이력서 분석 · 검색(RAG)**: 이력서 PDF 업로드 시 11단계 파이프라인으로 텍스트 추출 · 청킹 · 임베딩 · 요약 · 적합도 산출, 자연어 Top-K 검색
- **지원자 정보 통합 관리 · 채용 파이프라인**: 지원자를 채용 단계별 칸반으로 관리(드래그 앤 드롭), 카카오 · 네이버 · 구글 소셜 로그인으로 지원 현황 확인
- 회사(`com_id`) 기준 멀티테넌시 구조로 여러 회사 데이터 분리 관리 (2차 구조 유지)

---

## 6. 담당 업무 및 성과

20개 이상 도메인을 4명이 분담했습니다.

### 01. 최윤정 (팀장) — 회사 · 부서 · 인증 · 자원 예약 · 급여

**담당**: 회사 · 부서 관리, 인증 · 계정 보안, 자원 · 예약, 급여(신규 추가)

- **급여 산정 엔진**: `SalaryItemCalculator` 인터페이스 기반 10개 계산기 구현체, Spring `List` 주입으로 확장 가능한 구조 설계, 계산 근거 문자열 저장
- **급여 규정 AI Q&A(RAG)**: Top-K 3 · 유사도 임계값 0.3 기준 근거 판정, 근거 없으면 GPT API 미호출로 환각 방지, VectorDB 없이 애플리케이션 레이어에서 코사인 유사도 계산
- **인증 · 계정 보안**: JWT + Redis Refresh Token, 계정 잠금(15분 내 5회 실패), 비밀번호 정책(8자 이상 · 3종 조합), 로그인 이력 저장 실패해도 예외 전파 안 함
- 회사 · 부서 관리, 자원 · 예약 (2차 기능 유지 · 고도화)
- **성과**: 급여 계산기 간 순서 의존성 문제를 Strategy + DI 패턴으로 해결(의존 계산기가 필요한 선행 계산기를 직접 주입받아 호출)해, Spring `List` 주입 순서에 기대지 않는 안정적인 급여 계산 구조를 완성

| 급여 산정 엔진 | 급여 규정 AI Q&A (RAG) | 인증 · 계정 보안 | 
|:---:|:---:|:---:|
| ![급여산정엔진](https://github.com/yoonguri988/spring-breeze-erp/blob/e2b42be818c21f89bb46ee4654869a434f36b5b1/spring-breeze-erp-v3/docs/imgs/cyj/sal_stnd.PNG) | ![급여규정AI](https://github.com/yoonguri988/spring-breeze-erp/blob/e2b42be818c21f89bb46ee4654869a434f36b5b1/spring-breeze-erp-v3/docs/imgs/cyj/sal_al_llm.PNG) | ![계정보안](https://github.com/yoonguri988/spring-breeze-erp/blob/e2b42be818c21f89bb46ee4654869a434f36b5b1/spring-breeze-erp-v3/docs/imgs/cyj/login_security.PNG) |


### 02. 정수정 — 사원 · 인사평가 · 권한 · 직급 · 근태 · 연차 · 관리자 대시보드

**담당**: 사원, 인사평가, 권한, 직급, 근태, 연차, 관리자 대시보드 (2차 대비 근태 · 연차 · 관리자 대시보드 신규 추가)

- **근태 반영 AI 평가 리포트**: 부서장 코멘트 + 동기간 근태 통계를 함께 넘겨 사원별 평가 요약문 생성, 근태 통계는 쿼리 1회로 N+1 없이 집계, GPT 응답 검증 실패 · 요약문 공백 시 Mock 리포트로 자동 대체하고 warn 로그 기록
- **관리자 대시보드**: 근태 · 연차 잔여 · 전사 출근 현황 · 주간 추이 · 결재 대기 · 진행 중 프로젝트 등 6개 도메인을 API 1회 호출로 집계, 최근 5영업일 기준 주간 근태 추이 제공
- **HR 규정 AI 챗봇(RAG)**: 사내 규정 PDF를 조항 단위로 청킹 · 임베딩하고 질문과 유사한 조항을 찾아 근거로만 답변, 근거 조항을 못 찾으면 API 자체를 호출하지 않음
- 사원 CRUD, 인사평가, 권한 · 직급 (2차 기능 유지 · 고도화)
- **성과**: RAG 유사도 필터를 절대 임계값이 아닌 "1위 점수 대비 상대적 격차" 기준으로 재설계해, 정답 근거 조항이 데이터 분포에 따라 부당하게 탈락하는 문제를 해결

| 근태 반영 AI 평가 리포트 | 관리자 대시보드 | HR 규정 AI 챗봇 (RAG) |
|:---:|:---:|:---:|
| ![근태반영AI평가리포트](https://github.com/yoonguri988/spring-breeze-erp/blob/e2b42be818c21f89bb46ee4654869a434f36b5b1/spring-breeze-erp-v3/docs/imgs/jsj/eval_attr.PNG) | ![관리자대쉬보드](https://github.com/yoonguri988/spring-breeze-erp/blob/e2b42be818c21f89bb46ee4654869a434f36b5b1/spring-breeze-erp-v3/docs/imgs/jsj/emp_dashboard.PNG) | ![HR규정AI챗봇](https://github.com/yoonguri988/spring-breeze-erp/blob/e2b42be818c21f89bb46ee4654869a434f36b5b1/spring-breeze-erp-v3/docs/imgs/jsj/hr_ai_llm.PNG) |

### 03. 김주엽 — 전자결재 · 휴가 신청 · 사원 대시보드

**담당**: 전자결재(appr), 휴가 신청(leave request), 사원 대시보드

- **연차 신청 ↔ 결재 연동**: 연차 신청서 기안 시 신청 이력 생성, 최종 승인되면 잔여 연차 차감 및 근태 반영, 승인 시 `leave_request` 상태 · `leave_balance` 사용일수 · `attendance` 연차/반차 행 3개 테이블 동시 갱신, 신청일수는 시작일~종료일 중 토 · 일을 제외한 영업일수로 자동 산출(반차는 0.5일 고정)
- **결재선 위임 · 대결:** 대기 중인 결재선에 한해 다른 사원을 대결자로 지정하고 승인되면 결재선이 교체, 결재 당사자 · 문서 기안자만 위임 요청 가능, 본인을 대결자로 지정 불가 · 이미 같은 결재선에 있는 사람 불가 · 중복 요청 불가의 3중 차단
- **사원 대시보드**: 결재 대기 건수, 본인 기안 건수를 한눈에 확인
- **성과**: 연차 승인 시 잔여 연차 차감을 결재 도메인이 직접 갱신하지 않고 근태 도메인(`LeaveBalanceService`)이 소유하도록 경계를 분리해, 도메인 간 책임을 명확히 하면서도 승인 시점에 3개 테이블이 정합성 있게 갱신되는 구조를 완성

| 연차 신청 · 결재 연동 | 결재선 위임 · 대결 |
|:---:|:---:|
| ![연차신청결재연동](https://github.com/yoonguri988/spring-breeze-erp/blob/e2b42be818c21f89bb46ee4654869a434f36b5b1/spring-breeze-erp-v3/docs/imgs/kjy/appr_attr.PNG) | ![결재선위임대결](https://github.com/yoonguri988/spring-breeze-erp/blob/e2b42be818c21f89bb46ee4654869a434f36b5b1/spring-breeze-erp-v3/docs/imgs/kjy/appr_line_emp.PNG) |

### 04. 최다영 — 프로젝트 · 태스크 · 공지 · 채용 · 지원자 · 지원자 대시보드

**담당**: 프로젝트, 태스크, 공지사항, 채용, 지원자, 지원자 대시보드 (2차 대비 채용 · 지원자 · 지원자 대시보드 신규 추가)

- **AI 이력서 분석 · 검색(RAG)**: 이력서 PDF 업로드 시 파일 검증 → 소유권 확인 → PDF 텍스트 추출 → 청킹 분할 → 임베딩 저장 → AI 요약 · 적합도 산출까지 11단계 파이프라인으로 처리, 검색어를 임베딩해 이력서 청크와 코사인 유사도를 계산하고 높은 순으로 반환(자연어 · Top-K 검색), 이력서 재업로드 시 기존 파일 · 청크를 함께 삭제해 옛 임베딩이 검색에 남지 않도록 처리
- **지원자 정보 통합 관리 · 채용 파이프라인**: 지원자를 채용 단계별 칸반으로 관리하며 드래그 앤 드롭으로 단계 이동, 지원자는 카카오 · 네이버 · 구글 소셜 로그인으로 별도 회원가입 없이 본인 지원 현황 확인
- 프로젝트 · 태스크 · 공지사항 (2차 기능 유지)
- **성과**: 채용 도메인을 프로젝트 · 태스크에 새로 결합해 지원자 접수부터 이력서 검색까지 하나의 흐름으로 연결하고, 지원자의 현재 채용 단계와 전체 진행 상황을 한 화면에서 파악할 수 있게 구현

| AI 이력서 분석 · 검색 | 지원자 정보 통합 관리 |
|:---:|:---:|
| ![AI이력서분석검색](https://github.com/yoonguri988/spring-breeze-erp/blob/e2b42be818c21f89bb46ee4654869a434f36b5b1/spring-breeze-erp-v3/docs/imgs/cdy/ai_report_llm.PNG) | ![지원자정보통합관리](https://github.com/yoonguri988/spring-breeze-erp/blob/e2b42be818c21f89bb46ee4654869a434f36b5b1/spring-breeze-erp-v3/docs/imgs/cdy/hire.PNG) |

### ▶️ 파트별 시연 영상

| 담당자 | 담당 도메인 | 영&nbsp;상 |
|---|---|---|
| 최윤정 | 회사 · 부서 · 인증 · 자원예약 · 급여 | [시연 영상](https://youtu.be/AnIZ6A84pB8) |
| 정수정 | 사원 · 인사평가 · 권한 · 근태 · 연차 · 관리자대시보드 | [시연 영상](https://youtu.be/Kzew92ekSqw) |
| 김주엽 | 전자결재 · 휴가신청 · 사원대시보드 | [시연 영상](https://www.youtube.com/watch?v=do1A-hIby4U) |
| 최다영 | 프로젝트 · 태스크 · 공지 · 채용 · 지원자 | [시연 영상](https://youtu.be/FA7hXIXcytc?si=OJSQjeGewp9suwFf) |

---

## 7. 트러블슈팅

### 사례 1. 급여 계산 순서 의존성 (@최윤정)

| 구&nbsp;분 | 내용 |
|:---:|---|
| 문&nbsp;제 | 급여 항목별 계산기(`SalaryItemCalculator`)를 Strategy 패턴으로 나눴는데, 항목 간 계산 순서 의존성이 있어 Spring `List` 주입 순서만으로는 실행 순서를 보장할 수 없었음 |
| 원&nbsp;인 | 장기요양보험은 건강보험료를, 지방소득세는 소득세를 먼저 계산해야 하는 등 계산기 간 선후 관계가 존재했지만, Spring이 `List`로 주입하는 Bean 순서는 보장된 순서가 아니었음 |
| 해&nbsp;결 | `SalaryCalculationService`가 주입 순서에 기대지 않도록 하고, 의존 계산기(`LongTermCareInsuranceCalculator`, `LocalIncomeTaxCalculator`)가 필요한 선행 계산기(`HealthInsuranceCalculator`, `IncomeTaxCalculator`)를 Spring DI로 직접 주입받아 호출하도록 구조를 변경 |
| 성&nbsp;과 | 오케스트레이터는 순서와 무관하게 각 계산기의 결과만 모으면 되고, 선행 계산기는 필요한 곳에서 재사용되는 구조로 정리되어 계산 순서 문제가 근본적으로 해결됨 |
| 학&nbsp;습 | 계산 항목 간 순서 의존성은 "의존하는 쪽이 필요한 걸 직접 호출한다"는 방식이 Strategy + DI 구조와 더 잘 맞는다는 것을 체득 |

### 사례 2. RAG 유사도 필터 (@정수정)

| 구&nbsp;분 | 내용 |
|:---:|---|
| 문&nbsp;제 | 사내 규정 AI 챗봇에서 등록된 규정이 있는데도 "근거 조항 없음"으로 응답을 거부하는 사례 발생 — 유사도 필터를 절대 기준(임계값)으로 자르면 규정 전체가 "근거 없음"이 되어버림 |
| 원&nbsp;인 | 임계값을 0.15로 잡으면 관련 없는 조항까지 근거로 올라오고, 0.3으로 올리면 관련 있는 조항조차 탈락. 실제 정답 조항의 유사도가 0.25를 넘지 못해, 절대 기준 하나로는 필요한 근거만 걸러낼 수 없었음 |
| 해&nbsp;결 | "몇 점 이상"이라는 절대 기준을 버리고 1위 점수와 얼마나 가까운지를 기준으로 변경. 상위 5개 조항을 추린 뒤 1위 점수의 절반에 못 미치는 조항을 걸러내는 상대 기준 필터로 재설계(1위가 0.246이면 기준선 0.123, 1위가 0.5면 기준선 0.25) |
| 성&nbsp;과 | 임계값이 데이터 분포에 따라 자동으로 움직이게 되어, 규정 문서가 바뀌어도 필터를 다시 손볼 필요가 없어짐. 상위 조항 중 1위와 격차가 큰 것만 걸러지므로 정답 근처 조항이 살아남는 구조 확보 |
| 학&nbsp;습 | 유사도 점수는 그 자체로 "관련 있다"를 보장하지 않으며, 절대 기준을 고정하기 전에 로그로 점수 분포를 먼저 확인해야 한다는 것을 체득 |

### 사례 3. 연차 양식 필수 필드 (@김주엽)

| 구&nbsp;분 | 내용 |
|:---:|---|
| 문&nbsp;제 | 연차 신청서를 승인했는데도 잔여 연차가 차감되지 않는 사례 발생 — 결재는 승인 상태인데 연차 데이터는 그대로인 불일치 |
| 원&nbsp;인 | 연차 신청서는 문서 내용(JSON)에서 `leaveType` · `startDate` · `endDate` 키를 읽어 연차를 차감하는데, 결재 양식은 관리자가 에디터로 자유롭게 만들 수 있어 그 키가 없는 연차 양식도 등록될 수 있었음(검증이 승인 이후 파싱 시점에서야 이뤄짐) |
| 해&nbsp;결 | 검증 위치를 파싱 시점(뒤)에서 양식 등록 시점(앞)으로 이동 — LEAVE 카테고리 양식은 스키마 방식만 허용하고, 등록 시점에 필수 필드 3개(`leaveType`/`startDate`/`endDate`)가 모두 있는지 확인해 하나라도 빠지면 등록 자체를 차단 |
| 성&nbsp;과 | 잘못된 연차 양식이 애초에 만들어지지 않아 승인 후 파싱 실패로 인한 결재-연차 불일치가 사라졌고, 누락 필드명을 그대로 알려줘 관리자가 바로 고칠 수 있게 됨 |
| 학&nbsp;습 | 런타임에 터질 오류는 입력 시점에 막는 편이 훨씬 저렴하며, 승인 이후 터지면 이미 결재 이력이 쌓인 뒤라 되돌리는 비용이 크다는 것을 체득 |

### 사례 4. 채용 프로세스 관리 (@최다영)

| 구&nbsp;분 | 내용 |
|:---:|---|
| 문&nbsp;제 | 지원자가 늘어날수록 각 지원자가 현재 어떤 채용 단계에 있는지 일일이 확인해야 하고, 채용 공고별 진행 상황을 한눈에 파악하기 어려운 문제 발생 |
| 원&nbsp;인 | 지원자 정보와 채용 단계가 목록/상세 화면에 흩어져 있어, 단계별 현황을 파악하려면 지원자를 하나씩 열어 확인해야 했음 |
| 해&nbsp;결 | 지원자 상태를 채용 단계별 칸반 보드로 시각화하고, 드래그 앤 드롭으로 지원자를 단계 간 이동할 수 있도록 채용 파이프라인 UI를 구성 |
| 성&nbsp;과 | 지원자의 현재 위치와 채용 전체 흐름을 한눈에 확인할 수 있게 되어, 채용 담당자가 지원자 상태를 빠르게 파악하고 다음 조치를 결정할 수 있게 됨 |
| 학&nbsp;습 | 지원자 관리에서는 많은 정보를 보여주는 것보다, 담당자가 현재 상황을 빠르게 파악하고 다음 행동을 결정할 수 있도록 만드는 것이 중요하다는 것을 체득 |

---

## 8. 자체 평가

| 구&nbsp;분 | 내용 |
|:---:|---|
| ✅ **잘&nbsp;한&nbsp;점** | 2차 ERP를 Spring Boot 4 · JPA · JWT · React/Next.js로 전면 재구축하면서도 근태 → 연차 → 평가 → 급여로 이어지는 데이터 흐름을 끊기지 않게 설계<br>급여 계산기(Strategy + DI)와 RAG 파이프라인처럼 확장 가능한 구조를 초기에 도입<br>계정 잠금 · 비밀번호 정책 등 보안 요소를 설계 초기부터 반영<br>4명이 근태 · 평가 · 전자결재 · 채용까지 20개 이상 도메인을 분담 완료 |
| ⚠️ **아&nbsp;쉬&nbsp;운&nbsp;점** | 위임전결 자동화(`ApprAutoDelegation`)는 코드만 남기고 이번 배포 범위에서 제외<br>인가 모델 마이그레이션 미적용<br>회사별 정책(출근 기준 시각 · 평가 가중치 · 연차 산정 규칙 등)이 코드 상수로 고정되어 회사별 커스터마이징에 한계<br>RAG 유사도 필터가 상대 기준으로 개선되긴 했으나 VectorDB 없이 애플리케이션 레이어에서 계산해 문서가 늘어나면 성능 저하 우려 |
| 💡 **배&nbsp;운&nbsp;점** | 순서 의존성이 있는 로직은 주입 순서에 기대지 않고 의존하는 쪽이 필요한 걸 직접 호출하는 구조(Strategy + DI)가 더 안정적임<br>유사도 점수는 절대 기준보다 상대 기준으로 판단해야 하는 경우가 있음<br>런타임에 터질 오류는 입력(등록) 시점에 미리 막는 편이 비용이 훨씬 적음<br>도메인 간 책임 경계를 명확히 나누면(예: 연차 차감은 근태 도메인이 소유) 여러 도메인이 얽혀도 정합성을 지키기 쉬움 |
| 🚀 **다&nbsp;음&nbsp;개&nbsp;선&nbsp;방&nbsp;향** | 회사별 정책 값을 코드 상수 대신 테이블로 분리해 관리자가 직접 설정하게 하기<br>RAG 규정 문서를 벡터 DB로 이전해 검색 성능과 확장성 확보<br>위임전결 자동화 기능 정식 구현 및 인가 모델 마이그레이션 적용<br>도메인 통합 테스트와 AI 응답 검증 로직에 대한 단위 테스트 확대 |

---

## 9. 팀 회고

> 28일간의 재구축, 4명의 목소리

**@최윤정 (회사 · 부서 · 인증 · 자원예약 · 급여, 팀장)**
> 회사 · 부서 · 급여 · 인증 도메인을 맡으며 AI와 룰의 역할을 명확히 분리하고 판단 근거를 코드 주석으로 남기는 데 신경 썼습니다. MyBatis 레거시와 JPA 신규 모듈이 공존하는 구조를 직접 경험하면서, 도메인별 통합 · 단위 테스트는 갖췄지만 AI 변동 응답에 대한 로직 테스트는 상대적으로 부족했다는 것도 느꼈습니다. 다음에는 AI · 룰의 역할 분리 원칙을 설계 초기에 문서화 · 공유해 도메인 전반에 일관된 기준을 적용하고, 단일 EC2 기반 배포의 다운타임 · SPOF 위험을 낮추기 위해 로드밸런서와 다중 인스턴스, CloudWatch 기반 모니터링까지 구축해보고 싶습니다.

**@정수정 (사원 · 인사평가 · 권한 · 근태 · 연차 · 관리자대시보드)**
> 인사 · 근태 · 평가 · 권한 도메인을 맡으면서 출근 기준 시각, 평가 가중치, 연차 산정 규칙을 코드 상수로 고정해 기능 검증에만 집중했다는 한계를 느꼈습니다. 규정 청크를 전량 메모리에 올려 Java에서 코사인 유사도를 계산하다 보니 문서가 늘면 검색 시간이 함께 늘어날 거라는 점, 오전 반차여도 하루 전체 출근을 막고 영업일 계산에 공휴일이 빠져 있다는 점도 아쉬웠습니다. 사용자에게는 API 호출 실패와 실제 규정이 없는 상황이 똑같이 보인다는 것도 이번에 알게 됐고요. 다음에는 회사별 정책을 테이블로 분리해 관리자가 값을 정하게 하고, 벡터 DB 도입과 반차 시간대별 부분 출근 허용, 오류 상황을 별도로 안내하는 방향으로 개선하고 싶습니다.

**@김주엽 (전자결재 · 휴가신청 · 사원대시보드)**
> 전자결재 · 휴가 신청 · 사원 대시보드를 맡으며 승인 시점에 세 테이블을 차례로 갱신하는 구조를 만들었는데, 중간에 실패하면 되돌릴 수단이 없다는 게 계속 마음에 걸렸습니다. 필수 필드 검증이 연차(LEAVE) 카테고리 양식에만 적용돼 있는 점, 순차 승인만 지원하고 위임전결 자동화는 이번 스코프에서 제외한 점, 주말 제외 영업일 계산이 결재와 근태 양쪽에 따로 존재하는 점도 아쉬웠습니다. 다음에는 이벤트 기반 재처리로 일부 실패도 다시 맞출 수 있게 하고, 카테고리마다 스키마 계약을 정의해 자동화 양식을 안전하게 늘리고, 병렬 승인과 위임전결 자동화를 재개하고, 영업일 계산 로직을 공통 유틸로 분리하고 싶습니다.

**@최다영 (프로젝트 · 태스크 · 공지 · 채용 · 지원자)**
> 프로젝트 · 태스크 · 공지 · 채용 도메인을 맡으면서 이력서 청크를 전량 메모리에 올려 유사도를 계산하다 보니 지원자가 늘면 검색 속도가 함께 느려질 거라는 한계, 적합도 점수만 보이고 왜 그 점수인지 화면에 드러나지 않는다는 아쉬움을 느꼈습니다. 지원자별 정보와 지원 이력을 따로 확인해야 하는 번거로움, 지원자 상태가 바뀌어도 누가 언제 바꿨는지 이력이 남지 않는 점도 다음에 꼭 개선하고 싶은 지점입니다. 벡터 DB 도입으로 검색 속도를 유지하고, 근거 문장을 함께 노출해 채용 담당자가 점수를 검증할 수 있게 하고, 지원자 정보와 지원 이력을 한곳에서 관리하며, 상태 변경 전 로그를 남기고 지원자에게 알림을 보내는 방향으로 발전시키고 싶습니다.

---

## 10. 주요 설정 파일

- `build.gradle` — Spring Boot 4.0.7(Gradle), Java 17 toolchain, `spring-boot-starter-web/data-jpa/validation`, `mybatis-spring-boot-starter` 4.0.1, `spring-boot-starter-security/data-redis/oauth2-client`, JWT(`jjwt-api/impl/jackson` 0.11.5), `springdoc-openapi-starter-webmvc-ui` 3.0.3, `ojdbc11`(Oracle), `spring-dotenv`, `pdfbox` 3.0.5, `spring-boot-starter-mail`, `net.nurigo:sdk`(CoolSMS) 4.3.2
- `application.yml` / `application-prod.yml` / `application-oauth.yml` — Oracle 18c XE 데이터소스, Redis 연결(host/port/timeout), JWT 발급자 · 만료시간(AccessToken 15분 / RefreshToken 2시간), 로그인 잠금 정책(15분 내 5회), OpenAI · Naver OCR · 국세청 · CoolSMS · Discord Webhook · Google API 키를 환경변수로 분리
- `MyBatisConfig.java` — JPA와 MyBatis를 하이브리드로 함께 사용하기 위한 `SqlSessionFactory` / MapperScan 설정
- `mybatis-config.xml` — DTO Type Alias 및 MyBatis 공통 설정(`mapUnderscoreToCamelCase`)
- `configureStore.js` — `@reduxjs/toolkit` `configureStore` + `redux-saga` 미들웨어, `next-redux-wrapper`로 Next.js SSR과 Redux 스토어 연결

---

## 📄 라이선스

본 프로젝트는 spring-breeze 팀의 교육용 협업 프로젝트입니다.
