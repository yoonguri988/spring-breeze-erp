# 🏢 SBerp v2 (spring-breeze-erp-v2)

Spring Breeze 팀의 전사적 자원관리(ERP) 시스템 2차 프로젝트입니다.<br/>
1차 프로젝트(JSP · MySQL)를 **Spring Boot · Thymeleaf · Oracle 18c 기반으로 리팩토링하고, AI와 외부 API를 결합해 고도화**했습니다.

---

## 1. 프로젝트 개요

**SBerp v2**는 1차 프로젝트의 ERP 시스템을 Spring Boot · Thymeleaf · Oracle 18c 기반으로 리팩토링하고, AI와 외부 API를 결합해 고도화한 2차 프로젝트입니다.<br/>
회사 · 부서 · 자원 예약, 인사 · 평가 · 권한, 전자결재, 프로젝트 · 태스크 · 공지까지 4개 파트가 사원 · 부서 데이터를 공유하는 협업 구조로 설계했습니다.

- **프로젝트 성격**: 팀 프로젝트 (4인, 1차 프로젝트 리팩토링 및 고도화)
- **도메인**: Enterprise Resource Planning (ERP)
- **대상 사용자**: 중소 규모 기업의 관리자 / 임직원
- **핵심 도메인**: 6개 (회사 · 부서 · 자원 예약 / 인사 · 평가 · 권한 / 전자결재 / 프로젝트 · 태스크 · 공지)
- **신규 기능**: AI · 외부 API 연동 8종 이상

### 기획 의도

- **REAL**: 결재 · 인사 · 자원 · 프로젝트 등 실무에서 매일 마주치는 도메인 구조를 학습
- **COMPLEX**: 사원 · 부서 정보를 공유하는 4개 파트를 처음부터 협업 구조로 설계
- **FULLSTACK**: 백엔드 · DB · 뷰 · AI · 외부 API를 하나의 서비스에서 통합 구현

---

## 2. 기간 / 인원

- **개발 기간**: 2026.07.02 ~ 2026.07.15 (14일)
- **팀 인원**: 4명 (Spring Breeze)

| 단계 | 기간 | 내용 |
|---|---|---|
| 리팩토링 | 07.02 ~ 07.07 | Spring Boot · Thymeleaf · Oracle 마이그레이션 |
| 신규 기능 | 07.08 ~ 07.12 | 팀원별 신규 페이지 · AI/API 통합 (M1: 1차 개발 완료) |
| QA & 시연 | 07.13 ~ 07.15 | 통합 테스트 · 리허설 · 시연 준비 (M2: 2차 개발 완료) |

---

## 3. 기술 스택

### Backend

![Java](https://img.shields.io/badge/Java%2017-007396?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot%203.5.16-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![MyBatis](https://img.shields.io/badge/MyBatis-000000?style=for-the-badge&logoColor=white)

### Frontend (View Layer)

![Thymeleaf](https://img.shields.io/badge/Thymeleaf-005F0F?style=for-the-badge&logo=thymeleaf&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap%205-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Database

![Oracle](https://img.shields.io/badge/Oracle%2018c-F80000?style=for-the-badge&logo=oracle&logoColor=white)

### External API / AI

![OpenAI](https://img.shields.io/badge/GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)
![Naver](https://img.shields.io/badge/Naver%20OCR-03C75A?style=for-the-badge&logo=naver&logoColor=white)
![data.go.kr](https://img.shields.io/badge/국세청%20공공데이터-0B6E4F?style=for-the-badge)
![Discord Webhook](https://img.shields.io/badge/Discord%20Webhook-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![SMTP](https://img.shields.io/badge/SMTP%20Mail-EA4335?style=for-the-badge&logo=gmail&logoColor=white)
![Google Docs](https://img.shields.io/badge/Google%20Docs%20API-4285F4?style=for-the-badge&logo=googledocs&logoColor=white)
![PDFBox](https://img.shields.io/badge/Apache%20PDFBox-D22128?style=for-the-badge&logo=apache&logoColor=white)

### Collaboration / Tools

![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)

---

## 4. 시스템 구조

### ERD (Entity Relationship Diagram)

`company`를 중심으로 통합된 멀티 테넌시 구조입니다.

- **ORGANIZATION / HR**: `company`, `department`, `employee`, `emp_position`, `authority`, `emp_auth`, `dept_transfer_log`
- **APPROVAL**: `appr_form`, `appr_doc`, `appr_line`
- **PROJECT / TASK / NOTICE**: `project`, `project_member`, `task`, `notice`
- **RESOURCE**: `com_resource`, `reservation`
- **EVALUATION**: `evaluation_period`, `performance_evaluation`, `evaluation_ai_report`

![2차ERD](https://github.com/yoonguri988/spring-breeze-erp/blob/c5ccab28075eda31bd4deb0cddd3413d7655ecdd/spring-breeze-erp-v2/docs/img/sberp_v2_erd.PNG)

### 시스템 워크플로우 (Layered Architecture)

```
[ L1 CLIENT ] → [ L2 PRESENTATION ] → [ L3 APPLICATION ] → [ L4 PERSISTENCE ] → [ L5 EXTERNAL ]
   Browser         Thymeleaf(View)         @Service            MyBatis            OpenAI
   Web UI          Controller(Spring MVC)  Spring Security      Oracle 18c         Discord · OCR
```

1. **CLIENT**: 브라우저에서 요청 발생
2. **PRESENTATION**: Thymeleaf 뷰 렌더링, Spring MVC 컨트롤러가 요청 매핑
3. **APPLICATION**: Service 계층에서 비즈니스 로직 처리, Spring Security로 인가 검증
4. **PERSISTENCE**: MyBatis Mapper를 통해 Oracle 18c와 통신
5. **EXTERNAL**: 필요 시 OpenAI, Discord, Naver OCR, 국세청 API 등 외부 서비스 연동

---

## 5. 주요 기능

- 사업자등록증 OCR 자동 등록 및 국세청 실시간 진위 검증(3중 검증, 응답 지연 시 Fallback 처리)
- AI 기반 부서 이관 추천 및 부서 삭제 시 안전한 연쇄 이관 처리
- 자원 예약 동시성 제어(기간 겹침 검증, 실시간 잔여 수량 조회)
- 사원 온보딩 메일 자동 발송 및 입사 3일 뒤 적응 확인 메일 자동화
- AI 기반 인사 평가 리포트 요약 및 6단계 진행 상태 관리
- AI 결재 양식 생성 · 동적 스키마 렌더링, 버전 관리 · 순차 승인 시스템
- Oracle 재귀 CTE 기반 태스크 트리 조회 및 후행 일정 자동 갱신
- AI 기반 프로젝트 리스크 판정(HIGH · MID · LOW) 및 Discord 실시간 알림
- 주간 보고서 자동 생성(팀장용 Google Docs 자동 저장, 개인용 PDF 즉시 다운로드)

---

## 6. 담당 업무 및 성과

4개 핵심 파트를 4명이 나누어 담당했습니다.

### 01. 최윤정 (팀장) — 회사 · 부서 · 자원 예약

**담당**: 사업자등록증 OCR 등록, 국세청 실시간 검증, AI 부서 이관 추천, 자원 예약 동시성 제어

- **사업자등록증 OCR 등록**: Naver OCR로 이미지 1장에서 사업자번호 · 상호명 · 대표자명 · 개업일자 · 업종 등 6개 필드 자동 인식, 인식 실패 시 수동 입력으로 전환
- **국세청 실시간 검증**: 사업자번호 · 대표자명 · 개업일자 · 휴폐업 여부를 공공데이터 API로 3중 검증, 응답 지연 시 Fallback 응답으로 서버 스레드 보호
- **AI 부서 이관 추천**: 부서 삭제 시 유사 부서를 AI가 추천, 관리자가 최종 승인. 이관 후보가 없을 때도 전체 활성 부서로 자동 폴백
- **자원 예약 동시성 제어**: 기간 겹침(Overlap) 조회와 실시간 잔여 수량 조회로 동시 예약 충돌 방지
- **성과**: OCR · 국세청 API 연동으로 사업자등록증 등록 소요시간을 약 69.57% 단축(46초 → 14초)하고 잘못된 사업자번호 유입을 100% 차단, AI 부서 이관과 자원 예약에 트랜잭션 안전장치를 마련해 데이터 정합성을 확보


|  |  |
|:---:|:---:|
| **사업자등록증 OCR 등록** | **국세청 실시간 검증** |
| ![사업자등록증OCR등록](https://github.com/yoonguri988/spring-breeze-erp/blob/c5ccab28075eda31bd4deb0cddd3413d7655ecdd/spring-breeze-erp-v2/docs/img/cyj/com_naver_ocr.PNG) | ![국세청실시간검증](https://github.com/yoonguri988/spring-breeze-erp/blob/c5ccab28075eda31bd4deb0cddd3413d7655ecdd/spring-breeze-erp-v2/docs/img/cyj/com_data_api.PNG) |
| **AI 부서 이관 추천** | **자원 예약 동시성 제어** |
| ![AI부서이관추천](https://github.com/yoonguri988/spring-breeze-erp/blob/c5ccab28075eda31bd4deb0cddd3413d7655ecdd/spring-breeze-erp-v2/docs/img/cyj/dept_transfer.PNG) | ![자원예약동시성제어](https://github.com/yoonguri988/spring-breeze-erp/blob/c5ccab28075eda31bd4deb0cddd3413d7655ecdd/spring-breeze-erp-v2/docs/img/cyj/resv_control.PNG) |

### 02. 정수정 — 인사 · 평가 · 권한

**담당**: 온보딩 메일 자동화, AI 평가 리포트 요약

- **온보딩 메일 자동화**: 사원 등록 즉시 온보딩 메일, 입사 3일 뒤 적응 확인 메일을 자동 발송, 발송 실패 건은 재확인 후 재발송
- **AI 평가 리포트 요약**: 평가 마감 시 OpenAI가 사원별 코멘트를 요약, 평가 진행 상태를 6단계로 세분화해 실패 지점을 명시적으로 관리
- **성과**: 반복적인 메일 발송 · 리포트 취합 업무를 자동화해 담당자의 수작업을 줄이고, AI 응답 이상 시에도 안전한 기본값으로 100% 대체해 서비스 안정성을 확보

| 온보딩 메일 자동화 | AI 평가 리포트 요약 |
|:---:|:---:|
| ![온보딩메일자동화](https://github.com/yoonguri988/spring-breeze-erp/blob/c5ccab28075eda31bd4deb0cddd3413d7655ecdd/spring-breeze-erp-v2/docs/img/jsj/emp_onboarding.PNG) | ![AI평가리포트요약](https://github.com/yoonguri988/spring-breeze-erp/blob/c5ccab28075eda31bd4deb0cddd3413d7655ecdd/spring-breeze-erp-v2/docs/img/jsj/emp_eval.PNG) |

### 03. 김주엽 — 전자결재

**담당**: AI 결재 양식 생성, 동적 스키마 렌더링, 순차 승인 시스템

- **AI 결재 양식 생성**: 관리자가 원하는 양식을 문장으로 설명하면 GPT JSON mode가 구조화된 필드를 생성, 관리자 검수 후 등록
- **동적 스키마 렌더링**: 생성된 스키마를 텍스트 · 날짜 · 셀렉트 입력 폼으로 실시간 렌더링, 필수 필드는 제출 전 프론트엔드에서 검증
- **버전 관리 · 순차 승인**: 양식 수정/삭제 시 버전을 분리하고 소프트 삭제로 과거 문서를 보존, 결재선은 직급 순서 기반으로 자동 필터링되며 동시 승인이 구조적으로 차단
- **성과**: 결재 양식 작성 시간을 AI로 단축하면서도 과거 문서 참조 무결성을 100% 보존하는 버전 관리 체계를 구축

| AI 결재 양식 생성 | 동적 스키마 렌더링 | 순차 승인 |
|:---:|:---:|:---:|
| ![ai결재양식생성](https://github.com/yoonguri988/spring-breeze-erp/blob/5ca29f7dbce26cd886dc341cf7e7d25557869874/spring-breeze-erp-v2/docs/img/kjy/doc_llm.PNG) | ![동적스키마렌더링](https://github.com/yoonguri988/spring-breeze-erp/blob/5ca29f7dbce26cd886dc341cf7e7d25557869874/spring-breeze-erp-v2/docs/img/kjy/doc_dynamic_schema.PNG) | ![순차승인](https://github.com/yoonguri988/spring-breeze-erp/blob/5ca29f7dbce26cd886dc341cf7e7d25557869874/spring-breeze-erp-v2/docs/img/kjy/appr_line.PNG) |

### 04. 최다영 — 프로젝트 · 태스크 · 공지

**담당**: 재귀 CTE 기반 태스크 트리, AI 리스크 판정, 주간 보고서 자동화

- **재귀 CTE 태스크 트리**: Oracle 재귀 CTE로 태스크 트리를 깊이 제한 없이 한 번에 조회, 선행 일정 수정 시 후행 태스크까지 자동 갱신, 순환 참조는 CHECK 제약과 자바 검증으로 이중 방어
- **AI 리스크 판정**: 정량 지표를 종합해 AI가 HIGH · MID · LOW로 리스크를 판정, HIGH 등급은 Discord Webhook으로 실시간 알림
- **주간 보고서 자동화**: 프로젝트 데이터를 집계해 AI가 요약, 팀장용은 Google Docs에 자동 저장, 개인용은 PDF로 즉시 다운로드
- **성과**: 5단계 이상 깊이의 태스크 의존성도 한 번의 API 호출로 정확히 갱신되도록 구현하고, 리스크 감지와 보고서 작성을 자동화해 팀장의 취합 업무를 크게 줄임

| 재귀 CTE 태스크 트리 · Discord 알림 | 주간 보고서 자동화 |
|:---:|:---:|
| ![태스크트리및디스코드알림](https://github.com/yoonguri988/spring-breeze-erp/blob/5ca29f7dbce26cd886dc341cf7e7d25557869874/spring-breeze-erp-v2/docs/img/cdy/proj_discord_webhook.PNG) | ![주간보고서자동화](https://github.com/yoonguri988/spring-breeze-erp/blob/5ca29f7dbce26cd886dc341cf7e7d25557869874/spring-breeze-erp-v2/docs/img/cdy/week_report.PNG) |

### ▶️ 파트별 시연 영상

| 담당자 | 담당 도메인 | 영&nbsp;상 |
|---|---|---|
| 최윤정 | 회사 · 부서 · 자원 예약 | [시연 영상](https://youtu.be/IeCpmTbJOy0) |
| 정수정 | 인사 · 평가 · 권한 | [시연 영상](https://youtu.be/ceK_r-3BIsk) |
| 김주엽 | 전자결재 | [시연 영상](https://youtu.be/B9whOtAjBmo) |
| 최다영 | 프로젝트 · 태스크 · 공지 | [시연 영상](https://youtu.be/Jr_1rsLRPBE) |

---

## 7. 트러블슈팅

### 사례 1. 부서 삭제 시 연쇄 이관 처리 (@최윤정)

| 구&nbsp;분 | 내용 |
|:---:|---|
| 문&nbsp;제 | 부서를 삭제하려면 소속 사원을 다른 부서로 옮겨야 하는데, 관리자가 조직 전체 상황을 다 알기 어려워 어디로 옮길지 판단하기 어려움 |
| 원&nbsp;인 | 예약 · 결재 등 여러 모듈이 부서가 아닌 사원(`emp_id`)을 참조하고 있다는 구조를 파악하지 못한 상태에서 이관 대상 범위를 부서 단위로 넓게 잡고 있었음 |
| 해&nbsp;결 | 이관 대상을 사원 단위로 좁히고 여러 사원 이관을 `@Transactional`로 묶어 하나라도 실패하면 전체 롤백되도록 설계, `dept_status`를 3단계(ACTIVE → PENDING_DELETE → DELETED)로 관리 |
| 성&nbsp;과 | 사원 전원 이관 완료 시 부서가 자동으로 소프트 삭제되며, 트랜잭션 실패 시에도 데이터 정합성 유지율 100% 확보 |
| 학&nbsp;습 | 예약 · 결재가 모두 `emp_id`를 참조한다는 것을 알게 되어, 사원의 소속 부서 하나만 바꾸면 나머지는 FK를 타고 자연히 따라온다는 것을 체득 |

### 사례 2. AI 리포트 생성 중단 시 상태 관리 (@정수정)

| 구&nbsp;분 | 내용 |
|:---:|---|
| 문&nbsp;제 | 회차 마감을 누르고 AI가 리포트를 만드는 도중 서버가 재시작되거나 응답이 없으면 회차가 '완료' 상태인 채로 멈추는 상황 발생 |
| 원&nbsp;인 | 개발 초기에는 실패 단계를 따로 구분하지 않아, 정상 흐름만 상정한 상태 값으로 설계되어 있었음 |
| 해&nbsp;결 | 평가 진행 단계를 6단계(준비 → 진행 → 마감 → 리포트 생성 → 완료 / 실패 시 재시도)로 세분화해 '실패'와 '리포트 작업중' 상태를 따로 만듦 |
| 성&nbsp;과 | 관리자가 상황을 확인하고 재생성을 시도할 수 있게 됐고, 동일한 방식을 온보딩 메일 자동 발송에도 적용해 누락 건을 재확인 후 재발송 |
| 학&nbsp;습 | 잘 되는 경우만 상정해 설계하면 실패했을 때 원인을 찾기 어렵다는 것, 실패 단계를 명시적으로 드러내는 것이 시스템을 오히려 안정적으로 만든다는 것을 배움 |

### 사례 3. 결재 양식 버전 관리 버그 (@김주엽)

| 구&nbsp;분 | 내용 |
|:---:|---|
| 문&nbsp;제 | 이미 사용된 결재 양식을 수정 · 삭제해도 과거 문서는 안전해야 하는데, AI 스키마 기능 추가 후 스키마를 변경해도 버전이 그대로인 현상 발생 |
| 원&nbsp;인 | 버전 분기 조건이 `forContent`/`forTitle`만 비교하고 있었고, AI 스키마 양식은 `forContent`가 원래 비어있어 '변경 없음'으로 잘못 판정되는 구조였음 |
| 해&nbsp;결 | `forSchema` 비교 조건을 추가하고, 기존 필드처럼 공백 차이로 인한 오탐을 막기 위해 동일한 방식으로 비교하도록 수정 |
| 성&nbsp;과 | 에디터 · AI 스키마 두 방식 모두 내용이 바뀌면 예외 없이 새 버전으로 분리되고, 과거 버전은 그대로 보존돼 참조 무결성 유지(과거 문서 영향 0건) |
| 학&nbsp;습 | 새 기능을 추가할 때 그 기능이 건드리는 값이 기존 비교 · 검증 로직에도 반영됐는지 매번 점검해야 한다는 것을 체감 |

### 사례 4. 후행 태스크 일정 자동 갱신 (@최다영)

| 구&nbsp;분 | 내용 |
|:---:|---|
| 문&nbsp;제 | 태스크 일정을 수정하면 후행(자식) 태스크가 연쇄적으로 밀려야 하는데, 자바 for 루프로 한 단계씩 밀다 보니 손자 · 증손자 태스크는 반영되지 않고 매 수정마다 전체 태스크를 재조회하는 비효율까지 겹침 |
| 원&nbsp;인 | 계층형 데이터를 애플리케이션 레벨의 반복문으로 순회하려 한 접근 자체가 깊은 트리 구조에서는 구조적으로 한계가 있었음 |
| 해&nbsp;결 | Oracle 재귀 CTE(`START WITH ... CONNECT BY PRIOR`)로 후행 태스크 트리를 한 번의 쿼리로 조회하고 PL/SQL 익명 블록으로 벌크 업데이트, 순환 참조는 `ck_task_not_self_parent` CHECK 제약 + 자바 `isCyclic()` 이중 방어 |
| 성&nbsp;과 | 5단계 이상 깊이의 의존성 트리도 한 번의 API 호출로 정확히 갱신, 반응 속도가 체감상 크게 개선 |
| 학&nbsp;습 | 계층 · 트리 데이터는 자바 재귀보다 SQL 재귀 CTE가 훨씬 자연스럽고 빠르다는 것을 배움. '루프로 밀어내기'에서 '한 번에 계산하기'로 사고를 전환하는 계기가 됨 |

---

## 8. 자체 평가

| 구&nbsp;분 | 내용 |
|:---:|---|
| ✅ **잘&nbsp;한&nbsp;점** | AI · 외부 API 8종 이상(OpenAI · Naver OCR · 국세청 API · Discord · SMTP · Google Docs · PDFBox)을 4명이 나누어 실제 서비스 수준으로 연동<br>OCR 자동 인식으로 사업자등록증 등록 소요시간 약 69.57% 단축<br>결재 버전 관리 · 부서 이관 롤백 등 데이터 정합성을 지키는 안전장치를 각자 설계<br>재귀 CTE, 복합 인덱스 등 Oracle 성능 최적화 기법 적용 |
| ⚠️ **아&nbsp;쉬&nbsp;운&nbsp;점** | 삭제 · 버전관리 · 트랜잭션 같은 부수 효과를 초기 설계에 충분히 반영하지 못해 트러블슈팅 사례처럼 재설계가 필요했던 지점이 다수 발생<br>AI 응답이 실패하거나 지연될 때의 상태 관리를 처음부터 세분화하지 못해 재작업 발생<br>14일이라는 짧은 기간에 리팩토링과 8종 이상의 신규 AI/API 기능을 함께 진행해 일정이 타이트했음 |
| 💡 **배&nbsp;운&nbsp;점** | 단순해 보이는 CRUD(삭제)에도 FK 정합성 · 트랜잭션 · 예외 처리가 필요하다는 것을 체감(최윤정)<br>실패 상태를 세분화해 명시적으로 관리해야 시스템이 원활히 복구된다는 것을 배움(정수정)<br>기능 하나를 바꿀 때 전체 데이터 · 기존 문서에 미치는 영향을 먼저 검토하는 습관이 생김(김주엽)<br>계층형 데이터는 애플리케이션 재귀보다 SQL 재귀 CTE로 처리하는 게 더 자연스럽고 빠르다는 것을 배움(최다영) |
| 🚀 **다&nbsp;음&nbsp;개&nbsp;선&nbsp;방&nbsp;향** | 기술 적용 자체보다 사용자에게 실제로 필요한 기능이 무엇인지 고민하는 과정을 더 우선순위에 두기<br>양식 · 데이터 변경이 기존 리소스에 미치는 영향을 설계 단계에서부터 검토하는 습관 유지<br>기능 변경 전 연관 데이터 영향도 검토를 팀 공통 프로세스로 정착<br>단순 CRUD에도 정합성 · 트랜잭션 · 예외 처리 체크리스트 적용 |

---

## 9. 팀 회고

> 14일간의 리팩토링과 AI 기능 고도화, 4명의 목소리

**@최윤정 (회사 · 부서 · 자원 예약, 팀장)**
> 단순 CRUD인 줄 알았던 삭제 기능 하나에도 많은 안전장치가 필요하다는 걸 체감했고, 단순 DELETE 쿼리 하나 짤 줄 알았는데 FK 걸린 데이터 처리하려니 트랜잭션 묶고 예외 케이스 챙기는 게 생각보다 컸습니다.

**@정수정 (인사 · 평가 · 권한)**
> 기술 자체의 적용보다 실제로 사용자에게 필요한 기능이 무엇인지 고려하는 것이 어려운 일이었습니다. 메일 발송이든 리포트 요약이든, 기능 개발은 반복되는 사용자의 노력과 시간을 절약하는 방향으로 설계하는 것이 중요하다고 느꼈습니다.

**@김주엽 (전자결재)**
> 양식 수정/삭제 시 기존 문서에 미칠 영향을 인지했고, 삭제 시에는 논리 삭제를, 수정 시 신규 버전 생성 방식을 구현했습니다. 이 과정을 통해 기능 하나를 개발할 때 전체 데이터에 영향이 가게 되는 걸 먼저 생각하는 습관이 생겼습니다.

**@최다영 (프로젝트 · 태스크 · 공지)**
> 태스크 의존성과 일정 연쇄 변경 기능을 구현하면서 하나의 기능이 다른 데이터에 미치는 영향을 고려하는 경험을 할 수 있었습니다. 또한 권한 처리와 예외 상황을 함께 설계하며 안정적인 서비스를 만드는 과정의 중요성을 배울 수 있었습니다.

---

## 10. 주요 설정 파일

- `pom.xml` — Spring Boot 3.5.16 · Java 17, MyBatis(`mybatis-spring-boot-starter` 3.0.5), Spring Security, Oracle JDBC(`ojdbc11`), Thymeleaf Layout Dialect(3.3.0), OAuth2 Client, Apache PDFBox(3.0.1), jsoup(1.14.3) 등
- 메일 · 알림: `spring-boot-starter-mail`(SMTP), Nurigo CoolSMS SDK — 온보딩 메일 · 알림 발송에 사용
- MyBatis Mapper XML 기반 SQL 관리, `log4jdbc-log4j2`로 실제 실행 SQL 로깅
- Spring Security 기반 인증 · 인가, 세션 관리
- Oracle 18c 재귀 CTE, 복합 인덱스 등을 활용한 성능 최적화

---

## 📄 라이선스

본 프로젝트는 Spring Breeze 팀의 교육용 협업 프로젝트입니다.
