/* ==========================================================================
   SBerp — data.js  (mock master data, aligned to sb_erp_db schema)
   --------------------------------------------------------------------------
   모든 핵심 필드는 실제 DB 스키마의 컬럼명을 사용합니다.
   (company, department, emp_position, employee, authority, emp_auth,
    project, project_member, task, appr_form, appr_doc, appr_line,
    notice, resource, reservation)
   UI 표현용 보조값(색상/아이콘/태그 등)은 _ 로 시작하는 필드로 분리했습니다.
   ========================================================================== */
window.SBDATA = (function () {

  /* ---- company ---- */
  const company = {
    com_id: 1,
    indust_code: "J62",
    indust_name: "컴퓨터 프로그래밍, 시스템 통합 및 관리업",
    com_name: "(주)선빈테크놀로지",
    com_ceo: "김선빈",
    biz_no: "124-86-00000",
    com_tel: "02-1234-5678",
    com_logo: "S",
    created_at: "2017-03-02 09:00:00",
    updated_at: "2026-06-10 14:30:00",
  };

  /* ---- industries (업종 마스터) ----
     업종은 단일 선택. company.indust_code / indust_name 으로 저장됨. */
  const industries = [
    { indust_code: "J62", indust_name: "컴퓨터 프로그래밍, 시스템 통합 및 관리업" },
    { indust_code: "J58", indust_name: "출판업" },
    { indust_code: "C10", indust_name: "식료품 제조업" },
    { indust_code: "C30", indust_name: "기타 운송장비 제조업" },
    { indust_code: "D35", indust_name: "전기, 가스, 증기 및 공기 조절 공급업" },
    { indust_code: "F41", indust_name: "종합 건설업" },
    { indust_code: "G46", indust_name: "도매 및 상품 중개업" },
    { indust_code: "H49", indust_name: "육상 운송 및 파이프라인 운송업" },
    { indust_code: "K64", indust_name: "금융업" },
    { indust_code: "M73", indust_name: "전문 디자인업" },
    { indust_code: "P85", indust_name: "교육 서비스업" },
    { indust_code: "Q86", indust_name: "보건업" },
  ];

  /* ---- companies (관리자 화면: 다중 회사 목록) ----
     company 테이블 컬럼만 사용. 직원수(_emp_count)는 추후 쿼리로 집계하므로 보조 필드로 남김. */
  const companies = [
    { com_id: 1,  com_name: "(주)선빈테크놀로지",   com_ceo: "김선빈", biz_no: "124-86-00000", com_tel: "02-1234-5678", indust_code: "J62", indust_name: "컴퓨터 프로그래밍, 시스템 통합 및 관리업", com_logo: "S", created_at: "2017-03-02 09:00:00", updated_at: "2026-06-10 14:30:00", _emp_count: 142 },
    { com_id: 2,  com_name: "하나물류 주식회사",     com_ceo: "오세훈", biz_no: "220-81-12345", com_tel: "031-555-7788", indust_code: "H49", indust_name: "육상 운송 및 파이프라인 운송업", com_logo: null, created_at: "2015-07-14 09:00:00", updated_at: "2025-12-01 10:00:00", _emp_count: 86 },
    { com_id: 3,  com_name: "대성식품",             com_ceo: "이정민", biz_no: "312-85-66789", com_tel: "02-771-3300",  indust_code: "C10", indust_name: "식료품 제조업", com_logo: null, created_at: "2009-04-01 09:00:00", updated_at: "2024-03-18 09:00:00", _emp_count: 240 },
    { com_id: 4,  com_name: "블루오션 디자인",       com_ceo: "한지원", biz_no: "105-87-22113", com_tel: "02-3142-9080", indust_code: "M73", indust_name: "전문 디자인업", com_logo: null, created_at: "2019-11-20 09:00:00", updated_at: "2026-01-05 11:00:00", _emp_count: 32 },
    { com_id: 5,  com_name: "정우건설(주)",         com_ceo: "박정우", biz_no: "408-81-55021", com_tel: "053-244-1100", indust_code: "F41", indust_name: "종합 건설업", com_logo: null, created_at: "2002-02-18 09:00:00", updated_at: "2023-09-30 09:00:00", _emp_count: 410 },
    { com_id: 6,  com_name: "메디케어 헬스",         com_ceo: "최수연", biz_no: "214-88-30077", com_tel: "02-6000-2020", indust_code: "Q86", indust_name: "보건업", com_logo: null, created_at: "2013-09-09 09:00:00", updated_at: "2025-06-22 09:00:00", _emp_count: 178 },
    { com_id: 7,  com_name: "코어소프트",           com_ceo: "정해성", biz_no: "119-86-77654", com_tel: "070-8800-1234", indust_code: "J58", indust_name: "출판업", com_logo: null, created_at: "2018-06-25 09:00:00", updated_at: "2026-02-14 09:00:00", _emp_count: 54 },
    { com_id: 8,  com_name: "그린에너지 솔루션",     com_ceo: "윤재호", biz_no: "506-81-90012", com_tel: "052-700-4500", indust_code: "D35", indust_name: "전기, 가스, 증기 및 공기 조절 공급업", com_logo: null, created_at: "2016-03-30 09:00:00", updated_at: "2025-11-11 09:00:00", _emp_count: 121 },
    { com_id: 9,  com_name: "한빛교육그룹",         com_ceo: "서지안", biz_no: "211-87-44556", com_tel: "02-2050-3000", indust_code: "P85", indust_name: "교육 서비스업", com_logo: null, created_at: "2011-08-12 09:00:00", updated_at: "2024-07-19 09:00:00", _emp_count: 67 },
    { com_id: 10, com_name: "태평양무역",           com_ceo: "강동훈", biz_no: "617-85-10293", com_tel: "051-462-7000", indust_code: "G46", indust_name: "도매 및 상품 중개업", com_logo: null, created_at: "2007-05-22 09:00:00", updated_at: "2023-04-08 09:00:00", _emp_count: 95 },
    { com_id: 11, com_name: "넥스트모빌리티",       com_ceo: "임세라", biz_no: "144-86-88990", com_tel: "031-888-2200", indust_code: "C30", indust_name: "기타 운송장비 제조업", com_logo: null, created_at: "2020-01-10 09:00:00", updated_at: "2026-03-02 09:00:00", _emp_count: 203 },
    { com_id: 12, com_name: "우리금융데이터",       com_ceo: "문가은", biz_no: "101-86-33445", com_tel: "02-9000-1000", indust_code: "K64", indust_name: "금융업", com_logo: null, created_at: "2014-12-01 09:00:00", updated_at: "2025-08-27 09:00:00", _emp_count: 312 },
  ];

  /* ---- emp_position (직급) ---- */
  const positions = [
    { pos_id: 1, pos_code: "P1", pos_name: "사원", pos_order: 1, com_id: 1 },
    { pos_id: 2, pos_code: "P2", pos_name: "주임", pos_order: 2, com_id: 1 },
    { pos_id: 3, pos_code: "P3", pos_name: "대리", pos_order: 3, com_id: 1 },
    { pos_id: 4, pos_code: "P4", pos_name: "과장", pos_order: 4, com_id: 1 },
    { pos_id: 5, pos_code: "P5", pos_name: "차장", pos_order: 5, com_id: 1 },
    { pos_id: 6, pos_code: "P6", pos_name: "팀장", pos_order: 6, com_id: 1 },
  ];

  /* ---- department ----
     dept_id, com_id, parent_id, dept_name, dept_code, depth, sort_order, emp_id(부서장), created_at, updated_at
     _lead(부서장명) / _count(인원수)는 화면 보조 — 인원수는 추후 쿼리 집계. */
  const departments = [
    { dept_id: 1, com_id: 1, parent_id: null, dept_name: "경영지원본부", dept_code: "MGT", depth: 1, sort_order: 1, emp_id: 1005, created_at: "2017-03-02 09:00:00", updated_at: "2024-01-02 09:00:00", _lead: "정해솔", _count: 12 },
    { dept_id: 2, com_id: 1, parent_id: 1,    dept_name: "인사팀",       dept_code: "HR",  depth: 2, sort_order: 1, emp_id: 1003, created_at: "2017-03-02 09:00:00", updated_at: "2024-01-02 09:00:00", _lead: "한지우", _count: 6 },
    { dept_id: 3, com_id: 1, parent_id: 1,    dept_name: "재무팀",       dept_code: "FIN", depth: 2, sort_order: 2, emp_id: 1007, created_at: "2017-03-02 09:00:00", updated_at: "2024-01-02 09:00:00", _lead: "오세영", _count: 5 },
    { dept_id: 4, com_id: 1, parent_id: null, dept_name: "개발본부",     dept_code: "DEV", depth: 1, sort_order: 2, emp_id: 1002, created_at: "2017-03-02 09:00:00", updated_at: "2024-01-02 09:00:00", _lead: "이도윤", _count: 28 },
    { dept_id: 5, com_id: 1, parent_id: 4,    dept_name: "플랫폼개발팀", dept_code: "PLT", depth: 2, sort_order: 1, emp_id: 1006, created_at: "2017-03-02 09:00:00", updated_at: "2024-01-02 09:00:00", _lead: "김도현", _count: 11 },
    { dept_id: 6, com_id: 1, parent_id: 4,    dept_name: "프론트엔드팀", dept_code: "FE",  depth: 2, sort_order: 2, emp_id: 1008, created_at: "2017-03-02 09:00:00", updated_at: "2024-01-02 09:00:00", _lead: "장하린", _count: 9 },
    { dept_id: 7, com_id: 1, parent_id: 4,    dept_name: "QA팀",         dept_code: "QA",  depth: 2, sort_order: 3, emp_id: 1009, created_at: "2017-03-02 09:00:00", updated_at: "2024-01-02 09:00:00", _lead: "윤서준", _count: 5 },
    { dept_id: 8, com_id: 1, parent_id: null, dept_name: "영업본부",     dept_code: "SAL", depth: 1, sort_order: 3, emp_id: 1004, created_at: "2017-03-02 09:00:00", updated_at: "2024-01-02 09:00:00", _lead: "최민재", _count: 18 },
    { dept_id: 9, com_id: 1, parent_id: 8,    dept_name: "마케팅팀",     dept_code: "MKT", depth: 2, sort_order: 1, emp_id: 1010, created_at: "2017-03-02 09:00:00", updated_at: "2024-01-02 09:00:00", _lead: "배수아", _count: 7 },
  ];

  /* ---- authority (역할) ---- */
  const authorities = [
    { aut_id: 1, com_id: 1, aut_name: "시스템 관리자", _color: "red",    _users: 2,  _desc: "전 시스템 설정 및 사용자/권한 관리" },
    { aut_id: 2, com_id: 1, aut_name: "본부장",        _color: "violet", _users: 4,  _desc: "본부 단위 데이터 열람 및 최종 결재" },
    { aut_id: 3, com_id: 1, aut_name: "팀장",          _color: "blue",   _users: 12, _desc: "팀 데이터 관리 및 1차 결재" },
    { aut_id: 4, com_id: 1, aut_name: "일반 사원",     _color: "gray",   _users: 89, _desc: "본인 업무 데이터 입력/조회" },
    { aut_id: 5, com_id: 1, aut_name: "인사 담당자",   _color: "amber",  _users: 3,  _desc: "사원/조직/근태 데이터 관리" },
    { aut_id: 6, com_id: 1, aut_name: "재무 담당자",   _color: "green",  _users: 3,  _desc: "예산/지출/결재 정산 관리" },
  ];

  /* 권한 매트릭스에서 쓰는 메뉴(모듈) 목록 */
  const modules = ["대시보드", "회사·부서", "사원관리", "권한관리", "전자결재", "프로젝트", "공지", "자원예약"];

  /* ---- employee ----
     dept_id / pos_id 는 FK. 화면 편의를 위해 _dept_name / _pos_name 도 함께 둠. */
  const firstPool = ["김","이","박","최","정","한","오","장","윤","배","신","문","조","임","권","서","강","조","유","남"];
  const givenPool = ["선빈","도윤","서아","민재","해솔","지우","세영","도현","하린","서준","수아","우진","가은","태경","수호","나윤","지안","예린","현우","채원"];
  const statusPool = [["재직","green"],["재직","green"],["재직","green"],["휴직","amber"],["원격","cyan"]];

  function makeEmp(i) {
    const fn = firstPool[i % firstPool.length];
    const gn = givenPool[(i * 3) % givenPool.length];
    const dept = departments[(i * 2) % departments.length];
    const pos = positions[i % positions.length];
    const st = statusPool[i % statusPool.length];
    return {
      emp_id: 1001 + i,
      emp_no: "E" + String(1001 + i),
      emp_name: fn + gn,
      emp_pass: "$2a$10$" + "x".repeat(22),
      emp_email: `${["kim","lee","park","choi","jung","han"][i % 6]}.${["sb","dy","sa","mj","hs","ji"][i % 6]}@sberp.co.kr`,
      emp_mobile: `010-${String(1000 + i * 37 % 9000).padStart(4, "0")}-${String(2000 + i * 53 % 8000).padStart(4, "0")}`,
      emp_status: st[0],
      hire_date: `20${18 + (i % 7)}-0${1 + (i % 9)}-${String(10 + (i % 18)).padStart(2, "0")}`,
      created_at: `20${18 + (i % 7)}-0${1 + (i % 9)}-${String(10 + (i % 18)).padStart(2, "0")} 09:00:00`,
      updated_at: "2026-06-10 14:30:00",
      com_id: 1,
      pos_id: pos.pos_id,
      dept_id: dept.dept_id,
      _pos_name: pos.pos_name,
      _dept_name: dept.dept_name,
      _dept_code: dept.dept_code,
      _status_color: st[1],
      _avatar: fn,
    };
  }
  const employees = Array.from({ length: 24 }, (_, i) => makeEmp(i));

  /* ---- emp_auth (사원-권한 매핑) ---- */
  const emp_auth = employees.slice(0, 6).map((e, i) => ({
    emp_aut_id: i + 1, emp_id: e.emp_id, aut_id: ((i % 6) + 1),
  }));

  /* ---- appr_form (결재 양식) ---- */
  const appr_forms = [
    { for_id: 1, com_id: 1, for_code: "F-EXP", for_title: "지출결의", for_content: "지출 결의 기본 양식", for_status: 1, for_created: "2025-01-02 09:00:00", for_updated: "2025-01-02 09:00:00" },
    { for_id: 2, com_id: 1, for_code: "F-BUY", for_title: "구매요청", for_content: "구매 요청 기본 양식", for_status: 1, for_created: "2025-01-02 09:00:00", for_updated: "2025-01-02 09:00:00" },
    { for_id: 3, com_id: 1, for_code: "F-GEN", for_title: "일반품의", for_content: "일반 품의 기본 양식", for_status: 1, for_created: "2025-01-02 09:00:00", for_updated: "2025-01-02 09:00:00" },
    { for_id: 4, com_id: 1, for_code: "F-ATT", for_title: "근태신청", for_content: "근태 신청 기본 양식", for_status: 1, for_created: "2025-01-02 09:00:00", for_updated: "2025-01-02 09:00:00" },
    { for_id: 5, com_id: 1, for_code: "F-CON", for_title: "계약품의", for_content: "계약 품의 기본 양식", for_status: 1, for_created: "2025-01-02 09:00:00", for_updated: "2025-01-02 09:00:00" },
  ];

  /* ---- appr_doc (결재 문서) ----
     doc_status: 대기 / 진행 / 승인 / 반려 */
  const appr_docs = [
    { doc_id: "AP-2026-0412", emp_id: 1010, for_id: 1, com_id: 1, doc_title: "2분기 마케팅 예산 집행안",        doc_content: "2분기 마케팅 캠페인 예산 집행 요청", doc_status: "대기", doc_created: "2026-06-15", doc_updated: "2026-06-15", _drafter: "배수아", _dept_name: "마케팅팀",      _amount: 28400000, _status_color: "amber", _step: "팀장 결재",   _urgent: true,  _form_title: "지출결의" },
    { doc_id: "AP-2026-0411", emp_id: 1003, for_id: 2, com_id: 1, doc_title: "신규 입사자 장비 구매 요청",       doc_content: "신규 입사자 노트북/모니터 구매", doc_status: "대기", doc_created: "2026-06-15", doc_updated: "2026-06-15", _drafter: "한지우", _dept_name: "인사팀",        _amount: 4200000,  _status_color: "amber", _step: "본부장 결재", _urgent: false, _form_title: "구매요청" },
    { doc_id: "AP-2026-0409", emp_id: 1006, for_id: 3, com_id: 1, doc_title: "외부 교육 참가 신청 (AWS Summit)", doc_content: "AWS Summit 참가 신청", doc_status: "진행", doc_created: "2026-06-14", doc_updated: "2026-06-15", _drafter: "김도현", _dept_name: "플랫폼개발팀",  _amount: 660000,   _status_color: "blue",  _step: "재무 검토",   _urgent: false, _form_title: "일반품의" },
    { doc_id: "AP-2026-0407", emp_id: 1008, for_id: 4, com_id: 1, doc_title: "연차 외 특별휴가 신청",            doc_content: "경조 특별휴가 신청", doc_status: "승인", doc_created: "2026-06-14", doc_updated: "2026-06-14", _drafter: "장하린", _dept_name: "프론트엔드팀",  _amount: 0,        _status_color: "green", _step: "완료",        _urgent: false, _form_title: "근태신청" },
    { doc_id: "AP-2026-0405", emp_id: 1001, for_id: 2, com_id: 1, doc_title: "사무용품 정기 구매 (6월)",         doc_content: "6월 정기 사무용품 구매", doc_status: "대기", doc_created: "2026-06-13", doc_updated: "2026-06-13", _drafter: "정해솔", _dept_name: "경영지원본부",  _amount: 1850000,  _status_color: "amber", _step: "팀장 결재",   _urgent: false, _form_title: "구매요청" },
    { doc_id: "AP-2026-0402", emp_id: 1004, for_id: 5, com_id: 1, doc_title: "협력사 계약 갱신 품의",            doc_content: "협력사 연간 계약 갱신", doc_status: "반려", doc_created: "2026-06-12", doc_updated: "2026-06-13", _drafter: "최민재", _dept_name: "영업본부",      _amount: 54000000, _status_color: "red",   _step: "반려됨",      _urgent: false, _form_title: "계약품의" },
    { doc_id: "AP-2026-0398", emp_id: 1009, for_id: 1, com_id: 1, doc_title: "재택근무 보조금 지급의 건",        doc_content: "재택근무 보조금 지급", doc_status: "승인", doc_created: "2026-06-11", doc_updated: "2026-06-12", _drafter: "윤서준", _dept_name: "QA팀",          _amount: 900000,   _status_color: "green", _step: "완료",        _urgent: false, _form_title: "지출결의" },
    { doc_id: "AP-2026-0395", emp_id: 1007, for_id: 1, com_id: 1, doc_title: "사내 워크숍 장소 대관",            doc_content: "사내 워크숍 장소 대관비", doc_status: "진행", doc_created: "2026-06-10", doc_updated: "2026-06-11", _drafter: "오세영", _dept_name: "재무팀",        _amount: 3200000,  _status_color: "blue",  _step: "본부장 결재", _urgent: false, _form_title: "지출결의" },
  ];

  /* ---- appr_line (결재선) ----
     lin_status: 대기 / 승인 / 반려, lin_order: 결재 순서 */
  const appr_lines = [
    { lin_id: 1, doc_id: "AP-2026-0412", emp_id: 1004, lin_order: 1, lin_status: "대기", lin_approved: null },
    { lin_id: 2, doc_id: "AP-2026-0412", emp_id: 1002, lin_order: 2, lin_status: "대기", lin_approved: null },
    { lin_id: 3, doc_id: "AP-2026-0409", emp_id: 1005, lin_order: 1, lin_status: "승인", lin_approved: "2026-06-14 16:20:00" },
    { lin_id: 4, doc_id: "AP-2026-0409", emp_id: 1007, lin_order: 2, lin_status: "대기", lin_approved: null },
    { lin_id: 5, doc_id: "AP-2026-0402", emp_id: 1004, lin_order: 1, lin_status: "반려", lin_approved: "2026-06-13 10:05:00" },
  ];

  /* ---- project ----
     pro_status: 진행중 / 검수 / 완료. emp_id = PM */
  const projects = [
    { pro_id: 1, pro_name: "SBerp v3.0 리뉴얼",     pro_desc: "ERP 전면 리뉴얼", pro_status: "진행중", start_date: "2026-03-01", end_date: "2026-09-30", created_at: "2026-03-01 09:00:00", updated_at: "2026-06-10 09:00:00", emp_id: 1002, com_id: 1, _code: "ERP-V3", _lead: "이도윤", _progress: 64,  _status_color: "blue",  _members: ["이","김","장","윤"], _tone: "blue" },
    { pro_id: 2, pro_name: "모바일 근태 앱 개발",   pro_desc: "모바일 근태 관리", pro_status: "진행중", start_date: "2026-04-01", end_date: "2026-08-15", created_at: "2026-04-01 09:00:00", updated_at: "2026-06-09 09:00:00", emp_id: 1008, com_id: 1, _code: "MOB-HR", _lead: "장하린", _progress: 38,  _status_color: "blue",  _members: ["장","박","신"],     _tone: "violet" },
    { pro_id: 3, pro_name: "데이터 웨어하우스 구축", pro_desc: "DW 및 분석 기반",  pro_status: "검수",   start_date: "2026-01-15", end_date: "2026-06-28", created_at: "2026-01-15 09:00:00", updated_at: "2026-06-12 09:00:00", emp_id: 1006, com_id: 1, _code: "DW-01",  _lead: "김도현", _progress: 88,  _status_color: "amber", _members: ["김","오","문"],     _tone: "cyan" },
    { pro_id: 4, pro_name: "고객 포털 UX 개선",     pro_desc: "고객 포털 사용성", pro_status: "완료",   start_date: "2026-02-01", end_date: "2026-05-20", created_at: "2026-02-01 09:00:00", updated_at: "2026-05-20 18:00:00", emp_id: 1010, com_id: 1, _code: "CX-22",  _lead: "배수아", _progress: 100, _status_color: "green", _members: ["배","최"],         _tone: "green" },
  ];

  /* ---- project_member ---- */
  const project_members = [
    { pm_id: 1,  role: "PM",     joined_at: "2026-03-01", project_pro_id: 1, emp_id: 1002 },
    { pm_id: 2,  role: "백엔드", joined_at: "2026-03-05", project_pro_id: 1, emp_id: 1006 },
    { pm_id: 3,  role: "프론트", joined_at: "2026-03-05", project_pro_id: 1, emp_id: 1008 },
    { pm_id: 4,  role: "QA",     joined_at: "2026-03-10", project_pro_id: 1, emp_id: 1009 },
    { pm_id: 5,  role: "PM",     joined_at: "2026-04-01", project_pro_id: 2, emp_id: 1008 },
    { pm_id: 6,  role: "백엔드", joined_at: "2026-04-03", project_pro_id: 2, emp_id: 1003 },
    { pm_id: 7,  role: "모바일", joined_at: "2026-04-03", project_pro_id: 2, emp_id: 1011 },
    { pm_id: 8,  role: "PM",     joined_at: "2026-01-15", project_pro_id: 3, emp_id: 1006 },
    { pm_id: 9,  role: "데이터", joined_at: "2026-01-20", project_pro_id: 3, emp_id: 1007 },
    { pm_id: 10, role: "PM",     joined_at: "2026-02-01", project_pro_id: 4, emp_id: 1010 },
  ];

  /* ---- task ----
     task_status: todo / doing / done.  pm_id_name = 담당자 이름(역정규화 컬럼) */
  const tasks = [
    { task_id: "T-210", task_name: "권한 매트릭스 데이터 모델 설계", task_desc: "권한 매트릭스 ERD 설계", task_status: "todo",  task_start_date: "2026-06-16", task_end_date: "2026-06-20", task_created_at: "2026-06-12", task_updated_at: "2026-06-12", pro_id: 1, pm_id: 2,  com_id: 1, pm_id_name: "김도현", _prio: "높음", _prio_color: "red",   _tags: ["백엔드"] },
    { task_id: "T-214", task_name: "조직도 트리 컴포넌트 와이어프레임", task_desc: "조직도 UI 와이어프레임", task_status: "todo",  task_start_date: "2026-06-17", task_end_date: "2026-06-22", task_created_at: "2026-06-12", task_updated_at: "2026-06-12", pro_id: 1, pm_id: 3,  com_id: 1, pm_id_name: "장하린", _prio: "보통", _prio_color: "amber", _tags: ["디자인"] },
    { task_id: "T-201", task_name: "결재선 자동 분기 로직 구현", task_desc: "결재선 자동 분기", task_status: "doing", task_start_date: "2026-06-13", task_end_date: "2026-06-18", task_created_at: "2026-06-11", task_updated_at: "2026-06-14", pro_id: 1, pm_id: 4,  com_id: 1, pm_id_name: "윤서준", _prio: "높음", _prio_color: "red",   _tags: ["백엔드","결재"] },
    { task_id: "T-205", task_name: "사원 목록 가상 스크롤 적용", task_desc: "대용량 목록 최적화", task_status: "doing", task_start_date: "2026-06-14", task_end_date: "2026-06-19", task_created_at: "2026-06-11", task_updated_at: "2026-06-14", pro_id: 1, pm_id: 1,  com_id: 1, pm_id_name: "이도윤", _prio: "보통", _prio_color: "amber", _tags: ["프론트"] },
    { task_id: "T-188", task_name: "디자인 토큰 시스템 정의", task_desc: "디자인 토큰 체계", task_status: "done",  task_start_date: "2026-06-05", task_end_date: "2026-06-10", task_created_at: "2026-06-02", task_updated_at: "2026-06-10", pro_id: 1, pm_id: 3,  com_id: 1, pm_id_name: "장하린", _prio: "보통", _prio_color: "amber", _tags: ["디자인"] },
    { task_id: "T-191", task_name: "SSO 로그인 연동", task_desc: "SSO 인증 연동", task_status: "done",  task_start_date: "2026-06-08", task_end_date: "2026-06-12", task_created_at: "2026-06-05", task_updated_at: "2026-06-12", pro_id: 1, pm_id: 2,  com_id: 1, pm_id_name: "김도현", _prio: "높음", _prio_color: "red",   _tags: ["인증"] },
    { task_id: "T-219", task_name: "푸시 알림 스펙 정의", task_desc: "푸시 알림 명세", task_status: "todo",  task_start_date: "2026-06-18", task_end_date: "2026-06-25", task_created_at: "2026-06-13", task_updated_at: "2026-06-13", pro_id: 2, pm_id: 6,  com_id: 1, pm_id_name: "박서아", _prio: "낮음", _prio_color: "gray",  _tags: ["기획"] },
    { task_id: "T-208", task_name: "GPS 출퇴근 검증 API", task_desc: "위치 기반 출퇴근 검증", task_status: "doing", task_start_date: "2026-06-15", task_end_date: "2026-06-21", task_created_at: "2026-06-12", task_updated_at: "2026-06-15", pro_id: 2, pm_id: 7,  com_id: 1, pm_id_name: "신우진", _prio: "높음", _prio_color: "red",   _tags: ["모바일"] },
  ];

  /* ---- notice ----
     bno, btitle, bcontent, bhit(조회수), bfile, emp_id, com_id
     _cat / _pinned 는 UI 보조 (스키마에 카테고리/고정 컬럼 없음) */
  const notices = [
    { bno: 1, btitle: "[필독] 2026년 하반기 정기 인사발령 안내", bcontent: "하반기 정기 인사발령을 안내합니다.", bhit: 842,  bfile: "안내문.pdf", created_at: "2026-06-15", updated_at: "2026-06-15", emp_id: 1003, com_id: 1, _author: "인사팀",         _cat: "인사", _cat_color: "blue",   _pinned: true },
    { bno: 2, btitle: "사내 통합 보안 점검 및 비밀번호 변경 요청", bcontent: "전사 보안 점검을 실시합니다.", bhit: 1204, bfile: "보안점검.pdf", created_at: "2026-06-14", updated_at: "2026-06-14", emp_id: 1006, com_id: 1, _author: "정보보안팀",     _cat: "보안", _cat_color: "red",    _pinned: true },
    { bno: 3, btitle: "여름 휴가철 연차 사용 권장 기간 안내", bcontent: "여름 연차 사용을 권장합니다.", bhit: 567,  bfile: null, created_at: "2026-06-12", updated_at: "2026-06-12", emp_id: 1001, com_id: 1, _author: "경영지원본부", _cat: "일반", _cat_color: "gray",   _pinned: false },
    { bno: 4, btitle: "신규 협업툴(SBerp v3) 베타 테스터 모집", bcontent: "베타 테스터를 모집합니다.", bhit: 731,  bfile: null, created_at: "2026-06-11", updated_at: "2026-06-11", emp_id: 1002, com_id: 1, _author: "개발본부",     _cat: "IT",   _cat_color: "violet", _pinned: false },
    { bno: 5, btitle: "6월 전사 월례회의 일정 변경 공지", bcontent: "월례회의 일정이 변경되었습니다.", bhit: 489,  bfile: null, created_at: "2026-06-10", updated_at: "2026-06-10", emp_id: 1001, com_id: 1, _author: "경영지원본부", _cat: "일반", _cat_color: "gray",   _pinned: false },
    { bno: 6, btitle: "사내 동호회 지원금 신청 안내 (3분기)", bcontent: "동호회 지원금 신청을 받습니다.", bhit: 322,  bfile: null, created_at: "2026-06-09", updated_at: "2026-06-09", emp_id: 1003, com_id: 1, _author: "인사팀",         _cat: "복지", _cat_color: "green",  _pinned: false },
    { bno: 7, btitle: "전자결재 시스템 정기 점검 안내 (6/18 02:00~04:00)", bcontent: "전자결재 정기 점검을 실시합니다.", bhit: 405,  bfile: null, created_at: "2026-06-08", updated_at: "2026-06-08", emp_id: 1002, com_id: 1, _author: "개발본부", _cat: "IT", _cat_color: "violet", _pinned: false },
  ];

  /* ---- resource ----
     res_type ENUM: 회의실 / 차량 / 장비.  quantity = 정원/수량 */
  const resources = [
    { res_id: 1, com_id: 1, res_code: "MR-A",  res_name: "대회의실 A",        res_type: "회의실", quantity: 20, remark: "빔프로젝터, 화상회의, 화이트보드", created_at: "2024-01-01 09:00:00", updated_at: "2024-01-01 09:00:00", _location: "본관 12F", _icon: "bi-easel2",       _tone: "blue",   _amenities: ["빔프로젝터","화상회의","화이트보드"] },
    { res_id: 2, com_id: 1, res_code: "MR-B",  res_name: "대회의실 B",        res_type: "회의실", quantity: 16, remark: "대형TV, 화상회의", created_at: "2024-01-01 09:00:00", updated_at: "2024-01-01 09:00:00", _location: "본관 12F", _icon: "bi-easel2",       _tone: "blue",   _amenities: ["대형TV","화상회의"] },
    { res_id: 3, com_id: 1, res_code: "MR-S1", res_name: "소회의실 1",        res_type: "회의실", quantity: 6,  remark: "모니터", created_at: "2024-01-01 09:00:00", updated_at: "2024-01-01 09:00:00", _location: "본관 11F", _icon: "bi-door-closed", _tone: "cyan",   _amenities: ["모니터"] },
    { res_id: 4, com_id: 1, res_code: "MR-S2", res_name: "소회의실 2",        res_type: "회의실", quantity: 4,  remark: "모니터", created_at: "2024-01-01 09:00:00", updated_at: "2024-01-01 09:00:00", _location: "본관 11F", _icon: "bi-door-closed", _tone: "cyan",   _amenities: ["모니터"] },
    { res_id: 5, com_id: 1, res_code: "CAR-1", res_name: "법인차량 (카니발)", res_type: "차량",   quantity: 7,  remark: "하이패스, 블랙박스", created_at: "2024-01-01 09:00:00", updated_at: "2024-01-01 09:00:00", _location: "지하주차장", _icon: "bi-car-front",  _tone: "violet", _amenities: ["하이패스","블랙박스"] },
    { res_id: 6, com_id: 1, res_code: "EQ-04", res_name: "노트북 대여 #04",   res_type: "장비",   quantity: 1,  remark: "MacBook Pro 16", created_at: "2024-01-01 09:00:00", updated_at: "2024-01-01 09:00:00", _location: "IT자산실",  _icon: "bi-laptop",      _tone: "amber",  _amenities: ["MacBook Pro 16"] },
  ];

  /* ---- reservation (예약) ----
     status ENUM: 확정 / 대기 / 취소.  _start/_end = 시간대 보조필드. emp_no = 예약자 사번 */
  const reservations = [
    { rev_id: 1, com_id: 1, res_id: 1, quantity: 8, status: "확정", req_date: "2026-06-16", remark: "v3 스프린트 플래닝", updated_at: "2026-06-15 18:00:00", emp_no: "E1002", _title: "v3 스프린트 플래닝", _by: "이도윤", _start: 9,  _end: 11, _tone: "blue" },
    { rev_id: 2, com_id: 1, res_id: 1, quantity: 4, status: "확정", req_date: "2026-06-16", remark: "마케팅 예산 리뷰",   updated_at: "2026-06-15 18:00:00", emp_no: "E1010", _title: "마케팅 예산 리뷰",   _by: "배수아", _start: 14, _end: 15, _tone: "violet" },
    { rev_id: 3, com_id: 1, res_id: 2, quantity: 6, status: "확정", req_date: "2026-06-16", remark: "신입 온보딩",       updated_at: "2026-06-15 18:00:00", emp_no: "E1003", _title: "신입 온보딩",       _by: "한지우", _start: 10, _end: 12, _tone: "amber" },
    { rev_id: 4, com_id: 1, res_id: 3, quantity: 2, status: "확정", req_date: "2026-06-16", remark: "1:1 면담",          updated_at: "2026-06-15 18:00:00", emp_no: "E1001", _title: "1:1 면담",          _by: "정해솔", _start: 13, _end: 14, _tone: "green" },
    { rev_id: 5, com_id: 1, res_id: 5, quantity: 3, status: "확정", req_date: "2026-06-16", remark: "고객사 방문",       updated_at: "2026-06-15 18:00:00", emp_no: "E1004", _title: "고객사 방문",       _by: "최민재", _start: 9,  _end: 13, _tone: "cyan" },
    { rev_id: 6, com_id: 1, res_id: 2, quantity: 5, status: "확정", req_date: "2026-06-16", remark: "QA 회고",           updated_at: "2026-06-15 18:00:00", emp_no: "E1009", _title: "QA 회고",           _by: "윤서준", _start: 16, _end: 17, _tone: "blue" },
  ];

  return {
    company, companies, industries, positions, departments, authorities, modules,
    employees, emp_auth, appr_forms, appr_docs, appr_lines,
    projects, project_members, tasks, notices, resources, reservations,
  };
})();
