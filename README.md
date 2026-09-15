# 🏢 spring-breeze-erp

spring-breeze 팀이 **1차 → 2차 → 3차**에 걸쳐 발전시켜온 **전사적 자원관리(ERP) 시스템**입니다.<br/>
JSP · MySQL 기반의 사내 통합 관리 시스템(v1)에서 출발해, <br/>Spring Boot · Oracle · AI 연동으로 고도화(v2)하고, <br/>최종적으로 **Spring Boot 4 · JPA · JWT · React/Next.js 기반의 HR 중심 통합 ERP**(v3)로 전면 재구축했습니다.

[![v3 발표자료](https://img.shields.io/badge/v3%20발표자료-PDF-EA4335?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)](https://github.com/yoonguri988/spring-breeze-erp/blob/7ff9f1dd54e90638b44b67dd90f2c2ed3d0cc295/spring-breeze-erp-v3/docs/SBerpV3.pdf)
[![v2 발표자료](https://img.shields.io/badge/v2%20발표자료-PDF-4285F4?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)](https://github.com/yoonguri988/spring-breeze-erp/blob/9a6ccbb7e00991b138fa688799ecd5627fa7f181/spring-breeze-erp-v2/docs/SBerpV2.pdf)
[![v1 발표자료](https://img.shields.io/badge/v1%20발표자료-PDF-757575?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)](https://github.com/yoonguri988/spring-breeze-erp/blob/7ef5aa948d281135fdc12a3a7b239520a6179b18/spring-breeze-erp-v1/docs/SBerpV1.pdf)

---

## 📌 프로젝트 소개

**SBerp**는 중소 규모 기업의 관리자 · 임직원 · 채용 지원자를 대상으로, 회사 · 부서 · 사원 · 프로젝트 · 전자결재 · 자원 예약부터 <br/>근태 · 연차 · 인사평가 · 급여 · 채용까지 **흩어진 사내 업무를 하나의 시스템으로 통합 관리**하는 것을 목표로 한 ERP입니다.

3번의 반복 개발을 거치며 "사원 한 명의 데이터가 끊김 없이 모든 도메인에 흐르게 만드는 것"을 최종 목표로 삼았고, <br/>v3에서는 근태 기록이 인사평가에 반영되고 연차 승인이 근태를 갱신하며 근태 · 평가 결과가 급여 산정으로 이어지는 구조를 완성했습니다.

- **도메인**: HR 중심 ERP (인사 · 근태 · 연차 · 평가 · 급여 · 전자결재 · 채용 · 프로젝트 · 자원)
- **대상 사용자**: 중소 규모 기업의 관리자 / 임직원 / 채용 지원자
- **최종 모듈 수**(v3 기준): 20개 이상
- **팀 구성**: spring-breeze 팀, v1 6인 → v2 · v3 4인

---

## 🚀 프로젝트 진화 과정

| 버전 | 개발 기간 | 인원 | 핵심 변화 | 상세 문서 |
|:---:|:---:|:---:|---|:---:|
| **v1** | 2025.06.11 ~ 06.26 | 6인 | JSP · MySQL 기반 신규 구축, <br/>8개 모듈(로그인 · 권한 / 회사 · 부서 / 사원 / 전자결재 / 프로젝트 · 태스크 / 자원 · 예약 / 공지) | [README](./spring-breeze-erp-v1/README.md) |
| **v2** | 2026.07.02 ~ 07.15 | 4인 | Spring Boot · Thymeleaf · Oracle 18c로 리팩토링, <br/>OCR · 국세청 API · AI 리포트 등 AI/외부 API 8종 이상 연동 | [README](./spring-breeze-erp-v2/README.md) |
| **v3** | 2026.08.01 ~ 08.28 | 4인 | Spring Boot 4 · JPA · JWT + Redis · React/Next.js로 전면 재구축, <br/>근태 · 연차 · 급여 · 채용 도메인 신규 개발, HR/급여 규정 RAG 챗봇 파이프라인 구축 | [README](./spring-breeze-erp-v3/README.md) |

> 각 버전의 담당 업무 상세, 트러블슈팅 전체 사례, 팀 회고 원문은 위 버전별 README를 참고해주세요.<br/>
> 이 문서는 프로젝트 전체를 요약한 **메인 README**입니다.

---

## 🛠 기술 스택 (최종 버전 v3 기준)

### Backend

![Java](https://img.shields.io/badge/Java%2017-007396?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot%204.0.7-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![JPA](https://img.shields.io/badge/JPA%20(Hibernate)-59666C?style=for-the-badge&logo=hibernate&logoColor=white)
![MyBatis](https://img.shields.io/badge/MyBatis-000000?style=for-the-badge&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white)

### Frontend

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

### Collaboration

![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)

> v1(JSP · MySQL · Bootstrap)과 v2(Spring Boot 3 · Thymeleaf · Oracle)의 스택 변화는 [진화 과정](#-프로젝트-진화-과정) 표의 버전별 README에서 확인할 수 있습니다.

---

## 🧩 시스템 구조 (v3 기준)

`com_id` 기준 **멀티테넌시 구조**를 유지하며, 조직 · 기준정보를 중심으로 근태 · 연차 · 평가 · 급여 · 규정 · 채용 도메인을 연결했습니다.

- **ORGANIZATION / HR**: `company`, `department`, `employee`, `emp_position`, `authority`, `emp_auth`
- **ATTENDANCE / LEAVE**: `attendance`, `leave_balance`, `leave_grant`
- **EVALUATION / SALARY**: `eval_report`, `salary_payment`
- **HR 규정 (RAG)**: `hr_plcy_doc` → `hr_plcy_chunk`
- **APPROVAL**: `appr_form`, `appr_doc`, `appr_line`
- **RECRUITMENT**: `applicant`, `resume`, `notice`
- **PROJECT / TASK / RESOURCE**: `project`, `project_member`, `task`, `resource`, `reservation`

![v3 ERD](https://github.com/yoonguri988/spring-breeze-erp/blob/e2b42be818c21f89bb46ee4654869a434f36b5b1/spring-breeze-erp-v3/docs/imgs/SBerpV3_ERD.PNG)

```
[ LOGIN ] → [ JWT 발급 / Redis Refresh Token ] → [ React/Next.js SSR 라우팅 ] → [ 도메인별 API ] → [ JPA + MyBatis 하이브리드 SERVICE_LAYER ] → [ Oracle 18c XE ]
```

- **인증**: 이메일 · 비밀번호 로그인, 15분 내 5회 실패 시 계정 잠금, AccessToken 15분 / RefreshToken(Redis) 2시간
- **HR/급여 규정 RAG 파이프라인(6단계)**: PDF 업로드 → 조항 단위 청킹 → 임베딩 → 코사인 유사도 계산 → 근거 판정 → 답변 생성 및 이력 저장 (근거 조항이 없으면 GPT API 자체를 호출하지 않아 비용 · 환각을 함께 차단)

---

## ✨ 핵심 기능 (v3 기준, 최종 완성형)

- **급여 산정 엔진**: `SalaryItemCalculator` 인터페이스 기반 계산기 구현체를 Spring `List`로 주입해 조합, 계산 근거를 문자열로 저장
- **급여 규정 AI Q&A(RAG)**: 사내 급여 규정을 조항 단위로 청킹 · 임베딩해 질문과 유사한 조항만 근거로 답변 (VectorDB 없이 애플리케이션 레이어에서 코사인 유사도 계산)
- **인증 · 계정 보안**: JWT + Redis 기반 인증, 계정 잠금, 비밀번호 정책(8자 이상 · 3종 조합)
- **근태 반영 AI 평가 리포트**: 부서장 코멘트와 근태 통계를 함께 넘겨 사원별 평가 요약문 생성, GPT 검증 실패 시 Mock 리포트로 자동 대체
- **관리자 대시보드**: 근태 · 연차 · 출근 현황 · 결재 대기 · 진행 중 프로젝트 등 6개 도메인을 API 1회 호출로 집계
- **HR 규정 AI 챗봇(RAG)**: 근태 · 연차 · 복리후생 등 사내 규정 조항 기반으로만 답변, 근거 없으면 API 호출 자체를 차단
- **연차 신청 ↔ 결재 연동**: 승인 즉시 `leave_request` · `leave_balance` · `attendance` 3개 테이블 동시 갱신
- **결재선 위임 · 대결**: 본인 지정 불가 · 중복 지정 불가 · 중복 요청 불가의 3중 차단
- **AI 이력서 분석 · 검색(RAG)**: 이력서 PDF 업로드 시 11단계 파이프라인으로 텍스트 추출 · 청킹 · 임베딩 · 요약 · 적합도 산출, 자연어 Top-K 검색
- **채용 파이프라인**: 지원자를 채용 단계별 칸반으로 관리(드래그 앤 드롭), 소셜 로그인으로 지원 현황 확인
- 회사(`com_id`) 기준 멀티테넌시로 여러 회사 데이터 분리 관리 (v1부터 유지)

---

## 👥 팀 구성 및 역할

4명의 핵심 팀원이 v2 · v3에 걸쳐 같은 파트를 이어받으며 도메인을 점차 확장했습니다. (v1은 6인 체제)

| 이름 | 역할 | v1 담당 | v2 담당 | v3 담당(최종) |
|---|:---:|---|---|---|
| **최윤정** | 팀장 | 회사 · 부서 · 인증 · 권한 | 회사 · 부서 · 자원 예약 | 회사 · 부서 · 인증 · 자원 예약 · **급여(신규)** |
| **정수정** | 팀원 | 사원 관리 | 인사 · 평가 · 권한 | 사원 · 인사평가 · 권한 · 직급 · **근태 · 연차 · 관리자 대시보드(신규)** |
| **김주엽** | 팀원 | 전자결재 양식 | 전자결재 | 전자결재 · **휴가 신청 · 사원 대시보드(신규)** |
| **최다영** | 팀원 | 프로젝트 · 태스크 | 프로젝트 · 태스크 · 공지 | 프로젝트 · 태스크 · 공지 · **채용 · 지원자 · 지원자 대시보드(신규)** |

각 팀원의 세부 구현 내용, 성과, 화면 캡처는 버전별 README의 "담당 업무 및 성과" 섹션에서 확인할 수 있습니다.

---

## 🎬 시연 영상 (v3 최신 기준)

| 담당자 | 담당 도메인 | 영상 |
|---|---|---|
| 최윤정 | 회사 · 부서 · 인증 · 자원예약 · 급여 | [보기](https://youtu.be/AnIZ6A84pB8) |
| 정수정 | 사원 · 인사평가 · 권한 · 근태 · 연차 · 관리자대시보드 | [보기](https://youtu.be/Kzew92ekSqw) |
| 김주엽 | 전자결재 · 휴가신청 · 사원대시보드 | [보기](https://www.youtube.com/watch?v=do1A-hIby4U) |
| 최다영 | 프로젝트 · 태스크 · 공지 · 채용 · 지원자 | [보기](https://youtu.be/FA7hXIXcytc?si=OJSQjeGewp9suwFf) |

> v1 · v2 시연 영상은 각 버전 README에 정리되어 있습니다.

---

## 🔧 트러블슈팅 하이라이트

3번의 반복 개발을 거치며 쌓인 대표 사례입니다. 전체 사례는 버전별 README 7장을 참고해주세요.

| 버전 | 사례 | 요약 |
|:---:|---|---|
| v3 | 급여 계산 순서 의존성 (@최윤정) | Spring `List` 주입 순서에 기대지 않도록, 의존 계산기가 선행 계산기를 DI로 직접 주입받아 호출하는 구조로 변경 |
| v3 | RAG 유사도 필터 (@정수정) | 절대 임계값 대신 "1위 점수 대비 상대적 격차" 기준으로 재설계해, 정답 근거 조항이 데이터 분포에 따라 부당하게 탈락하는 문제를 해결 |
| v2 | 부서 삭제 시 연쇄 이관 (@최윤정) | 이관 대상을 사원 단위로 좁히고 `@Transactional`로 묶어, 실패 시 전체 롤백 및 `dept_status` 3단계 관리 |
| v2 | 후행 태스크 일정 자동 갱신 (@최다영) | 자바 반복문 대신 Oracle 재귀 CTE로 태스크 트리를 한 번에 조회 · 갱신, 순환 참조는 CHECK 제약 + 자바 검증 이중 방어 |
| v1 | Git 협업 충돌 (1차 병합) | 6인 병렬 개발 후 병합 단계를 별도로 두어 충돌을 팀 단위로 점검, 이후 프로젝트부터 브랜치 전략을 초반에 합의 |

---

## 💡 프로젝트 종합 회고

| 구분 | 내용 |
|:---:|---|
| ✅ **잘한 점** | 1차 JSP/MySQL 신규 구축 → 2차 Spring Boot/Oracle 리팩토링 + AI/외부 API 8종 <br/>→ 3차 JWT/JPA/React 전면 재구축 + HR 전주기(근태, 연차, 급여,채용) 연결까지,<br/> 3번의 반복 개발로 아키텍처와 기술 스택을 단계적으로 고도화<br/>매 버전 급여 계산기(Strategy+DI), RAG 파이프라인 등 확장 가능한 구조를 설계 초기에 도입<br/>보안(계정 잠금 · 비밀번호 정책 · JWT+Redis)을 프로젝트 초반부터 지속적으로 강화 |
| ⚠️ **아쉬운 점** | 위임전결 자동화, 회사별 정책의 테이블화 등 일부 기능은 코드만 남기고 배포 범위에서 제외<br>RAG 유사도 계산을 VectorDB 없이 애플리케이션 레이어에서 처리해 문서 · 이력서가 늘어나면 성능 저하 우려<br>버전이 바뀔 때마다 인증 방식 · 뷰 레이어 · ORM이 함께 바뀌어 마이그레이션 비용이 매번 발생 |
| 🚀 **다음 개선 방향** | 회사별 정책 값을 코드 상수 대신 테이블로 분리해 관리자가 직접 설정하게 하기<br>RAG 규정 · 이력서 문서를 벡터 DB로 이전해 검색 성능과 확장성 확보<br>단일 서버 배포의 SPOF를 낮추기 위한 로드밸런서 · 다중 인스턴스 · 모니터링 구축<br>도메인 통합 테스트와 AI 응답 검증 로직에 대한 단위 테스트 확대 |

---

## 📂 레포지토리 구조

```
spring-breeze-erp/
├── spring-breeze-erp-v1/   # 1차: JSP · MySQL 신규 구축 (6인)
├── spring-breeze-erp-v2/   # 2차: Spring Boot · Thymeleaf · Oracle 리팩토링 + AI/외부 API (4인)
└── spring-breeze-erp-v3/   # 3차: Spring Boot 4 · JPA · JWT · React/Next.js 전면 재구축 (4인, 최신)
```

---

## 📄 라이선스

본 프로젝트는 spring-breeze 팀의 교육용 협업 프로젝트입니다.
