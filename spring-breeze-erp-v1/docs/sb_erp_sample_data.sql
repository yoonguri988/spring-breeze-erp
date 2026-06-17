-- =====================================================
-- sb_erp_db 샘플 데이터 INSERT SQL
-- 생성일: 2026-06-17
-- 외래키 의존 순서에 맞게 작성됨
-- =====================================================

USE `sb_erp_db`;

-- =====================================================
-- 1. company (회사)
-- =====================================================
INSERT INTO `company` (`com_id`, `indust_code`, `indust_name`, `com_name`, `com_ceo`, `biz_no`, `com_tel`, `com_logo`, `created_at`, `updated_at`) VALUES
(1, 'IT001', '정보통신업', '스마트빌더(주)', '김대표', '123-45-67890', '02-1234-5678', NULL, NOW(), NOW()),
(2, 'MFG001', '제조업', '한국제조(주)', '이사장', '987-65-43210', '031-9876-5432', NULL, NOW(), NOW()),
(3, 'SVC001', '서비스업', '글로벌서비스(주)', '박회장', '555-44-33221', '051-5554-4332', NULL, NOW(), NOW());


-- =====================================================
-- 2. department (부서) - 계층 구조 (parent_id 순서 주의)
-- =====================================================
-- com_id=1 회사 부서
INSERT INTO `department` (`dept_id`, `com_id`, `parent_id`, `dept_name`, `dept_code`, `depth`, `sort_order`, `emp_id`, `created_at`, `updated_at`) VALUES
(1,  1, NULL, '경영지원본부',  'HQ',      0, 1, NULL, NOW(), NOW()),
(2,  1, 1,    '인사팀',        'HR',      1, 1, NULL, NOW(), NOW()),
(3,  1, 1,    '재무팀',        'FIN',     1, 2, NULL, NOW(), NOW()),
(4,  1, NULL, '개발본부',      'DEV_HQ',  0, 2, NULL, NOW(), NOW()),
(5,  1, 4,    '백엔드팀',      'BACK',    1, 1, NULL, NOW(), NOW()),
(6,  1, 4,    '프론트엔드팀',  'FRONT',   1, 2, NULL, NOW(), NOW()),
-- com_id=2 회사 부서
(7,  2, NULL, '생산본부',      'PRD_HQ',  0, 1, NULL, NOW(), NOW()),
(8,  2, 7,    '생산1팀',       'PRD1',    1, 1, NULL, NOW(), NOW()),
(9,  2, 7,    '품질관리팀',    'QA',      1, 2, NULL, NOW(), NOW()),
-- com_id=3 회사 부서
(10, 3, NULL, '서비스본부',    'SVC_HQ',  0, 1, NULL, NOW(), NOW()),
(11, 3, 10,   '고객지원팀',    'CS',      1, 1, NULL, NOW(), NOW()),
(12, 3, 10,   '마케팅팀',      'MKT',     1, 2, NULL, NOW(), NOW());


-- =====================================================
-- 3. emp_position (직급)
-- =====================================================
INSERT INTO `emp_position` (`pos_id`, `com_id`, `pos_code`, `pos_name`, `pos_order`) VALUES
-- com_id=1
(1, 1, 'CEO',    '대표이사', 1),
(2, 1, 'DIR',    '이사',     2),
(3, 1, 'MGR',    '부장',     3),
(4, 1, 'STAFF',  '사원',     4),
-- com_id=2
(5, 2, 'CEO',    '대표이사', 1),
(6, 2, 'MGR',    '부장',     2),
(7, 2, 'STAFF',  '사원',     3),
-- com_id=3
(8, 3, 'CEO',    '대표이사', 1),
(9, 3, 'MGR',    '부장',     2),
(10,3, 'STAFF',  '사원',     3);


-- =====================================================
-- 4. employee (직원) - admin 계정 포함
-- 비밀번호: 'admin1234' → bcrypt 해시값 (실제 적용 시 앱에서 암호화 권장)
-- 테스트용 평문 패스: $2a$10$... 형식 사용
-- =====================================================
INSERT INTO `employee` (`emp_id`, `com_id`, `pos_id`, `dept_id`, `emp_no`, `emp_name`, `emp_pass`, `emp_email`, `emp_mobile`, `emp_status`, `hire_date`, `created_at`, `updated_at`) VALUES
-- [ADMIN] 시스템 관리자 계정 (com_id=1, 개발본부/백엔드팀)
(1, 1, 1, 5, 'EMP001', '관리자(admin)',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y',  -- 평문: admin1234
 'admin@smartbuilder.com', '010-0000-0001', '재직', '2020-01-01', NOW(), NOW()),

-- 일반 직원들 (com_id=1)
(2, 1, 2, 2, 'EMP002', '김인사',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',  -- 평문: password
 'kim.hr@smartbuilder.com', '010-1111-2222', '재직', '2021-03-15', NOW(), NOW()),

(3, 1, 3, 3, 'EMP003', '이재무',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'lee.fin@smartbuilder.com', '010-2222-3333', '재직', '2021-06-01', NOW(), NOW()),

(4, 1, 4, 5, 'EMP004', '박백엔드',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'park.back@smartbuilder.com', '010-3333-4444', '재직', '2022-01-10', NOW(), NOW()),

(5, 1, 4, 6, 'EMP005', '최프론트',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'choi.front@smartbuilder.com', '010-4444-5555', '재직', '2022-03-20', NOW(), NOW()),

-- com_id=2 직원
(6, 2, 5, 7, 'EMP101', '정생산',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'jung.prd@hankookmanufacture.com', '010-5555-6666', '재직', '2019-05-01', NOW(), NOW()),

(7, 2, 7, 8, 'EMP102', '오품질',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'oh.qa@hankookmanufacture.com', '010-6666-7777', '재직', '2020-09-01', NOW(), NOW()),

-- com_id=3 직원
(8, 3, 8, 10, 'EMP201', '강서비스',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'kang.svc@globalservice.com', '010-7777-8888', '재직', '2018-11-01', NOW(), NOW()),

(9, 3, 10, 11, 'EMP202', '윤고객',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'yoon.cs@globalservice.com', '010-8888-9999', '재직', '2021-07-15', NOW(), NOW());

-- department.emp_id (팀장) 업데이트
UPDATE `department` SET `emp_id` = 1 WHERE `dept_id` = 5;  -- 백엔드팀장 = admin
UPDATE `department` SET `emp_id` = 2 WHERE `dept_id` = 2;  -- 인사팀장
UPDATE `department` SET `emp_id` = 3 WHERE `dept_id` = 3;  -- 재무팀장
UPDATE `department` SET `emp_id` = 6 WHERE `dept_id` = 7;  -- 생산본부장
UPDATE `department` SET `emp_id` = 8 WHERE `dept_id` = 10; -- 서비스본부장


-- =====================================================
-- 5. authority (권한)
-- =====================================================
INSERT INTO `authority` (`aut_id`, `com_id`, `aut_name`) VALUES
(1, 1, 'ROLE_ADMIN'),
(2, 1, 'ROLE_MANAGER'),
(3, 1, 'ROLE_USER'),
(4, 2, 'ROLE_ADMIN'),
(5, 2, 'ROLE_USER'),
(6, 3, 'ROLE_ADMIN'),
(7, 3, 'ROLE_USER');


-- =====================================================
-- 6. emp_auth (직원-권한 매핑)
-- =====================================================
INSERT INTO `emp_auth` (`emp_aut_id`, `emp_id`, `aut_id`) VALUES
(1, 1, 1),   -- admin → ROLE_ADMIN (com1)
(2, 1, 2),   -- admin → ROLE_MANAGER (com1)
(3, 2, 2),   -- 김인사 → ROLE_MANAGER
(4, 3, 3),   -- 이재무 → ROLE_USER
(5, 4, 3),   -- 박백엔드 → ROLE_USER
(6, 5, 3),   -- 최프론트 → ROLE_USER
(7, 6, 4),   -- 정생산 → ROLE_ADMIN (com2)
(8, 7, 5),   -- 오품질 → ROLE_USER (com2)
(9, 8, 6),   -- 강서비스 → ROLE_ADMIN (com3)
(10,9, 7);   -- 윤고객 → ROLE_USER (com3)


-- =====================================================
-- 7. project (프로젝트)
-- =====================================================
INSERT INTO `project` (`pro_id`, `emp_id`, `com_id`, `pro_name`, `pro_desc`, `pro_status`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'ERP 시스템 구축', 'ERP 1차 구축 프로젝트', '진행중', '2026-01-01', '2026-12-31', NOW(), NOW()),
(2, 1, 1, '사내 포털 개편', '사내 인트라넷 UI/UX 개선', '대기', '2026-07-01', '2026-09-30', NOW(), NOW()),
(3, 6, 2, '스마트팩토리 도입', 'IoT 기반 생산라인 자동화', '진행중', '2026-03-01', '2026-11-30', NOW(), NOW());


-- =====================================================
-- 8. project_member (프로젝트 멤버)
-- =====================================================
INSERT INTO `project_member` (`pm_id`, `project_pro_id`, `emp_id`, `role`, `joined_at`) VALUES
(1, 1, 1, 'PM',       NOW()),
(2, 1, 4, 'Backend',  NOW()),
(3, 1, 5, 'Frontend', NOW()),
(4, 2, 1, 'PM',       NOW()),
(5, 2, 5, 'Frontend', NOW()),
(6, 3, 6, 'PM',       NOW()),
(7, 3, 7, 'QA',       NOW());


-- =====================================================
-- 9. task (업무/태스크)
-- =====================================================
INSERT INTO `task` (`task_id`, `pro_id`, `pm_id`, `com_id`, `task_name`, `task_desc`, `task_status`, `pm_id_name`, `task_start_date`, `task_end_date`, `task_created_at`, `task_updated_at`) VALUES
(1, 1, 2, 1, '로그인 API 개발',      'Spring Security 기반 JWT 로그인', '완료',   '박백엔드', '2026-01-05', '2026-01-20', NOW(), NOW()),
(2, 1, 3, 1, '메인 화면 UI 개발',    'Bootstrap5 기반 대시보드 화면',   '진행중', '최프론트', '2026-01-10', '2026-02-10', NOW(), NOW()),
(3, 1, 2, 1, '직원 관리 CRUD',       '직원 등록/수정/삭제/조회 기능',   '대기',   '박백엔드', '2026-02-01', '2026-03-01', NOW(), NOW()),
(4, 2, 5, 1, '포털 메인 페이지 설계','신규 인트라넷 메인 화면 기획',    '대기',   '최프론트', '2026-07-01', '2026-07-20', NOW(), NOW()),
(5, 3, 6, 2, 'IoT 센서 연동',        '생산라인 센서 데이터 수집 모듈',  '진행중', '정생산',   '2026-03-05', '2026-05-30', NOW(), NOW()),
(6, 3, 7, 2, '품질 이상 알림 개발',  '불량률 임계치 초과 시 알림',      '대기',   '오품질',   '2026-06-01', '2026-08-31', NOW(), NOW());


-- =====================================================
-- 10. appr_form (결재 양식)
-- =====================================================
INSERT INTO `appr_form` (`for_id`, `com_id`, `for_code`, `for_title`, `for_content`, `for_status (boolean)`, `for_created`, `for_updated`) VALUES
(1, 1, 'FORM_VCT', '연차신청서',   '<p>연차 신청 내용을 작성하세요.</p>', 1, NOW(), NOW()),
(2, 1, 'FORM_BIZ', '출장신청서',   '<p>출장 목적 및 일정을 작성하세요.</p>', 1, NOW(), NOW()),
(3, 1, 'FORM_EXP', '지출결의서',   '<p>지출 항목 및 금액을 작성하세요.</p>', 1, NOW(), NOW()),
(4, 2, 'FORM_VCT', '연차신청서',   '<p>연차 신청 내용을 작성하세요.</p>', 1, NOW(), NOW()),
(5, 2, 'FORM_MTL', '자재구매신청서','<p>구매 자재 및 수량을 작성하세요.</p>', 1, NOW(), NOW());


-- =====================================================
-- 11. appr_doc (결재 문서)
-- =====================================================
INSERT INTO `appr_doc` (`doc_id`, `emp_id`, `for_id`, `com_id`, `doc_title`, `doc_content`, `doc_status`, `doc_created`, `doc_updated`) VALUES
(1, 4, 1, 1, '[연차] 박백엔드 1월 연차 신청',   '1월 25일 연차 사용 신청합니다.',      'WAI', NOW(), NOW()),
(2, 5, 1, 1, '[연차] 최프론트 2월 연차 신청',   '2월 14일 연차 사용 신청합니다.',      'APR', NOW(), NOW()),
(3, 3, 2, 1, '[출장] 이재무 부산 출장 신청',    '2월 20일 부산 거래처 방문 출장.',     'WAI', NOW(), NOW()),
(4, 3, 3, 1, '[지출] 팀 회식비 지출 신청',      '팀 회식비 150,000원 지출 신청.',     'REJ', NOW(), NOW()),
(5, 7, 4, 2, '[연차] 오품질 연차 신청',          '3월 3일 개인 사유 연차 신청.',        'WAI', NOW(), NOW());


-- =====================================================
-- 12. appr_line (결재선)
-- lin_id AUTO_INCREMENT 누락된 DDL이므로 직접 지정
-- =====================================================
INSERT INTO `appr_line` (`lin_id`, `doc_id`, `emp_id`, `lin_order`, `lin_status`, `lin_approved`) VALUES
-- doc_id=1 결재선
(1,  1, 2, 1, 'WAI', NULL),   -- 김인사(팀장) 1차 결재 대기
(2,  1, 1, 2, 'WAI', NULL),   -- admin(임원) 2차 결재 대기
-- doc_id=2 결재선 (승인 완료)
(3,  2, 2, 1, 'APR', '2026-01-20 10:00:00'),
(4,  2, 1, 2, 'APR', '2026-01-20 15:00:00'),
-- doc_id=3 결재선
(5,  3, 2, 1, 'WAI', NULL),
(6,  3, 1, 2, 'WAI', NULL),
-- doc_id=4 결재선 (반려)
(7,  4, 2, 1, 'REJ', '2026-01-18 09:00:00'),
-- doc_id=5 결재선
(8,  5, 6, 1, 'WAI', NULL),
(9,  5, 8, 2, 'WAI', NULL);


-- =====================================================
-- 13. notice (공지사항)
-- =====================================================
INSERT INTO `notice` (`bno`, `emp_id`, `com_id`, `btitle`, `bcontent`, `bhit`, `bfile`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '[필독] ERP 시스템 오픈 안내',
 'ERP 시스템이 2026년 1월 1일부터 공식 오픈되었습니다. 사용 매뉴얼을 참고하여 주시기 바랍니다.',
 120, NULL, NOW(), NOW()),

(2, 2, 1, '[인사] 2026년 연차 사용 안내',
 '2026년 연차 일수 및 사용 방법을 안내드립니다. 연차 신청은 ERP 전자결재를 통해 진행해 주세요.',
 85, NULL, NOW(), NOW()),

(3, 1, 1, '[보안] 개인정보 보호 교육 실시',
 '2026년 상반기 개인정보 보호 교육을 실시합니다. 전 직원 필수 이수 바랍니다.',
 60, NULL, NOW(), NOW()),

(4, 6, 2, '[생산] 스마트팩토리 도입 일정 안내',
 '스마트팩토리 IOT 연동 작업이 3월부터 순차적으로 진행됩니다.',
 45, NULL, NOW(), NOW()),

(5, 8, 3, '[마케팅] 2분기 캠페인 계획 공유',
 '2026년 2분기 마케팅 캠페인 계획을 공유드립니다.',
 30, NULL, NOW(), NOW());


-- =====================================================
-- 14. resource (자원/자산)
-- =====================================================
INSERT INTO `resource` (`res_id`, `com_id`, `res_code`, `res_name`, `res_type`, `quantity`, `remark`, `created_at`, `updated_at`) VALUES
(1, 1, 'RM001', '대회의실',   'Romm', 1,  '최대 20인 수용', NOW(), NOW()),
(2, 1, 'RM002', '소회의실A',  'Romm', 1,  '최대 6인 수용',  NOW(), NOW()),
(3, 1, 'RM003', '소회의실B',  'Romm', 1,  '최대 6인 수용',  NOW(), NOW()),
(4, 2, 'RM001', '공장 회의실','Romm', 1,  '최대 10인 수용', NOW(), NOW()),
(5, 3, 'RM001', '고객 상담실','Romm', 2,  '상담 전용',      NOW(), NOW());


-- =====================================================
-- 15. reservation (예약)
-- =====================================================
INSERT INTO `reservation` (`rev_id`, `res_id`, `com_id`, `emp_id`, `quantity`, `status`, `req_date`, `remark`, `updated_at`) VALUES
(1, 1, 1, 1, 1, 'APP', '2026-06-20 10:00:00', 'ERP 킥오프 미팅',       NOW()),
(2, 2, 1, 4, 1, 'APP', '2026-06-18 14:00:00', '백엔드팀 코드 리뷰',    NOW()),
(3, 3, 1, 5, 1, 'WAI', '2026-06-25 13:00:00', '프론트엔드 디자인 회의',NOW()),
(4, 4, 2, 6, 1, 'APP', '2026-06-19 09:00:00', '스마트팩토리 업무 회의',NOW()),
(5, 5, 3, 9, 1, 'REJ', '2026-06-17 11:00:00', '고객 상담',             NOW());


-- =====================================================
-- 완료 확인 쿼리 (실행 후 검증용)
-- =====================================================
-- SELECT 'company'     AS tbl, COUNT(*) AS cnt FROM company
-- UNION ALL SELECT 'department',   COUNT(*) FROM department
-- UNION ALL SELECT 'emp_position', COUNT(*) FROM emp_position
-- UNION ALL SELECT 'employee',     COUNT(*) FROM employee
-- UNION ALL SELECT 'authority',    COUNT(*) FROM authority
-- UNION ALL SELECT 'emp_auth',     COUNT(*) FROM emp_auth
-- UNION ALL SELECT 'project',      COUNT(*) FROM project
-- UNION ALL SELECT 'project_member',COUNT(*) FROM project_member
-- UNION ALL SELECT 'task',         COUNT(*) FROM task
-- UNION ALL SELECT 'appr_form',    COUNT(*) FROM appr_form
-- UNION ALL SELECT 'appr_doc',     COUNT(*) FROM appr_doc
-- UNION ALL SELECT 'appr_line',    COUNT(*) FROM appr_line
-- UNION ALL SELECT 'notice',       COUNT(*) FROM notice
-- UNION ALL SELECT 'resource',     COUNT(*) FROM resource
-- UNION ALL SELECT 'reservation',  COUNT(*) FROM reservation;
