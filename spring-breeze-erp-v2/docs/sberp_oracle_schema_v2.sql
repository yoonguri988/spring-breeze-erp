--------------------------------------------------------------------------
-- SBerp Oracle Schema (수정본 v2)
-- 실행 계정: sberp (SYSTEM/SYS 계정에서 직접 실행 금지)
--
-- [v1 대비 주요 수정 사항]
-- 1. Oracle에서 사용 불가능한 // 주석 -> -- 로 전부 수정
-- 2. appr_line 트리거의 시퀀스 오타(appr_lin_seq -> appr_line_seq) 수정
-- 3. "creatae table task" 오타 수정
-- 4. 모든 FK 컬럼에 인덱스 추가 (Oracle은 FK 컬럼에 인덱스 자동 생성 안 함)
-- 5. department <-> employee 순환참조: department 부서장(emp_id) FK는
--    두 테이블 생성 후 ALTER TABLE로 추가
-- 6. UNIQUE 제약 추가: employee(com_id,emp_no), employee(emp_email),
--    emp_position(com_id,pos_code), appr_form(com_id,for_code),
--    appr_line(doc_id,lin_order)
-- 7. CHECK 제약 통일: appr_doc.doc_status, appr_line.lin_status 추가
-- 8. 날짜 타입을 DATE로 통일 (employee의 TIMESTAMP -> DATE)
-- 9. project/task에도 다른 테이블과 동일하게 BEFORE INSERT/UPDATE 트리거 추가
-- 10. project_member.role -> member_role (ROLE은 Oracle 예약어라 명칭 변경)
-- 11. task.pm_id_name(비정규화 컬럼) 삭제 - 필요 시 조인으로 조회
-- 12. 긴 텍스트가 들어갈 수 있는 컬럼(appr_doc.doc_content, notice.bcontent)은
--     VARCHAR2 -> CLOB으로 변경
--------------------------------------------------------------------------


--------------------------------------------------------------------------
-- 1. 회사
--------------------------------------------------------------------------
CREATE TABLE company (
  com_id            NUMBER NOT NULL,
  industry_grp_code VARCHAR2(100) NOT NULL,
  industry_code     VARCHAR2(100) NOT NULL,
  com_name          VARCHAR2(100) NOT NULL,
  com_ceo           VARCHAR2(100) NOT NULL,
  biz_no            VARCHAR2(45) NOT NULL,
  com_tel           VARCHAR2(100),
  com_logo          VARCHAR2(500),
  created_at        DATE DEFAULT SYSDATE NOT NULL,
  updated_at        DATE DEFAULT SYSDATE NOT NULL,
  CONSTRAINT pk_company PRIMARY KEY (com_id),
  CONSTRAINT uq_company_biz_no UNIQUE (biz_no)
);

CREATE SEQUENCE seq_company START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_company_bi
BEFORE INSERT ON company
FOR EACH ROW
BEGIN
  IF :NEW.com_id IS NULL THEN
    SELECT seq_company.NEXTVAL INTO :NEW.com_id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_company_bu
BEFORE UPDATE ON company
FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSDATE;
END;
/


--------------------------------------------------------------------------
-- 2. 부서
--    ※ 부서장(emp_id) FK는 employee 테이블 생성 후 하단에서 ALTER로 추가
--------------------------------------------------------------------------
CREATE TABLE department (
  dept_id     NUMBER NOT NULL,
  com_id      NUMBER NOT NULL,
  parent_id   NUMBER,
  dept_name   VARCHAR2(100),
  dept_code   VARCHAR2(100),
  depth       NUMBER,
  sort_order  NUMBER,
  emp_id      NUMBER,
  created_at  DATE DEFAULT SYSDATE,
  updated_at  DATE DEFAULT SYSDATE,
  CONSTRAINT pk_department PRIMARY KEY (dept_id),
  CONSTRAINT uq_department_com_code UNIQUE (com_id, dept_code),
  CONSTRAINT fk_department_company1
    FOREIGN KEY (com_id) REFERENCES company (com_id),
  CONSTRAINT fk_department_department1
    FOREIGN KEY (parent_id) REFERENCES department (dept_id)
    ON DELETE CASCADE
);

CREATE SEQUENCE seq_department START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_department_bi
BEFORE INSERT ON department
FOR EACH ROW
BEGIN
  IF :NEW.dept_id IS NULL THEN
    SELECT seq_department.NEXTVAL INTO :NEW.dept_id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_department_bu
BEFORE UPDATE ON department
FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSDATE;
END;
/

-- FK 컬럼 인덱스 (com_id는 uq_department_com_code 복합 UNIQUE 인덱스로 커버되므로 parent_id만 추가)
CREATE INDEX fk_department_department1_idx ON department (parent_id);


--------------------------------------------------------------------------
-- 3. 직급
--------------------------------------------------------------------------
CREATE TABLE emp_position (
  pos_id    NUMBER(10)   NOT NULL,
  pos_code  VARCHAR2(20) NOT NULL,
  pos_name  VARCHAR2(20) NOT NULL,
  pos_order NUMBER(10)   NOT NULL,
  com_id    NUMBER(10)   NOT NULL,
  CONSTRAINT pk_pos PRIMARY KEY (pos_id),
  CONSTRAINT uq_pos_com_code UNIQUE (com_id, pos_code),
  CONSTRAINT fk_pos_com
    FOREIGN KEY (com_id) REFERENCES company (com_id)
);

CREATE SEQUENCE seq_position START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_emp_position_pk
BEFORE INSERT ON emp_position
FOR EACH ROW
BEGIN
  IF :NEW.pos_id IS NULL THEN
    :NEW.pos_id := seq_position.NEXTVAL;
  END IF;
END;
/

-- com_id는 uq_pos_com_code 복합 UNIQUE 인덱스로 이미 커버됨


--------------------------------------------------------------------------
-- 4. 사원
--------------------------------------------------------------------------
CREATE TABLE employee (
  emp_id      NUMBER(10)      NOT NULL,
  emp_no      VARCHAR2(20)    NOT NULL,
  emp_name    VARCHAR2(50)    NOT NULL,
  emp_pass    VARCHAR2(500)   NOT NULL,
  emp_email   VARCHAR2(100)   NOT NULL,
  emp_mobile  VARCHAR2(20)    NOT NULL,
  emp_status  VARCHAR2(10)    DEFAULT '재직',
  hire_date   DATE,
  created_at  DATE            DEFAULT SYSDATE,
  updated_at  DATE            DEFAULT SYSDATE,
  com_id      NUMBER(10)      NOT NULL,
  pos_id      NUMBER(10)      NOT NULL,
  dept_id     NUMBER(10)      NOT NULL,
  CONSTRAINT pk_emp PRIMARY KEY (emp_id),
  CONSTRAINT uq_emp_com_no UNIQUE (com_id, emp_no),
  CONSTRAINT uq_emp_email UNIQUE (emp_email),
  CONSTRAINT ck_emp_status CHECK (emp_status IN ('재직','휴직','퇴직')),
  CONSTRAINT fk_emp_com
    FOREIGN KEY (com_id)  REFERENCES company(com_id),
  CONSTRAINT fk_emp_pos
    FOREIGN KEY (pos_id)  REFERENCES emp_position(pos_id),
  CONSTRAINT fk_emp_dept
    FOREIGN KEY (dept_id) REFERENCES department(dept_id)
);

CREATE SEQUENCE seq_employee START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_employee_pk
BEFORE INSERT ON employee
FOR EACH ROW
BEGIN
  IF :NEW.emp_id IS NULL THEN
    :NEW.emp_id := seq_employee.NEXTVAL;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_employee_updated_at
BEFORE UPDATE ON employee
FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSDATE;
END;
/

-- FK 인덱스 (com_id, emp_no는 uq_emp_com_no로 커버되므로 pos_id, dept_id만 추가)
CREATE INDEX fk_emp_pos_idx  ON employee (pos_id);
CREATE INDEX fk_emp_dept_idx ON employee (dept_id);

-- department -> employee 순환참조 해소: 부서장 FK를 이제서야 추가
ALTER TABLE department
  ADD CONSTRAINT fk_department_employee1
  FOREIGN KEY (emp_id) REFERENCES employee (emp_id);

CREATE INDEX fk_department_employee1_idx ON department (emp_id);


--------------------------------------------------------------------------
-- 5. 권한
--------------------------------------------------------------------------
CREATE TABLE authority (
  aut_id    NUMBER NOT NULL,
  com_id    NUMBER NOT NULL,
  aut_name  VARCHAR2(45),
  CONSTRAINT pk_authority PRIMARY KEY (aut_id),
  CONSTRAINT fk_authority_company1
    FOREIGN KEY (com_id) REFERENCES company (com_id)
);

CREATE SEQUENCE seq_authority START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_authority_bi
BEFORE INSERT ON authority
FOR EACH ROW
BEGIN
  IF :NEW.aut_id IS NULL THEN
    SELECT seq_authority.NEXTVAL INTO :NEW.aut_id FROM dual;
  END IF;
END;
/

CREATE INDEX fk_authority_company1_idx ON authority (com_id);


--------------------------------------------------------------------------
-- 6. 권한-사원 매핑
--------------------------------------------------------------------------
CREATE TABLE emp_auth (
  emp_aut_id  NUMBER NOT NULL,
  emp_id      NUMBER NOT NULL,
  aut_id      NUMBER NOT NULL,
  CONSTRAINT pk_emp_auth PRIMARY KEY (emp_aut_id),
  CONSTRAINT uq_emp_auth UNIQUE (emp_id, aut_id),
  CONSTRAINT fk_emp_auth_employee1
    FOREIGN KEY (emp_id) REFERENCES employee (emp_id),
  CONSTRAINT fk_emp_auth_authority1
    FOREIGN KEY (aut_id) REFERENCES authority (aut_id)
);

CREATE SEQUENCE seq_emp_auth START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_emp_auth_bi
BEFORE INSERT ON emp_auth
FOR EACH ROW
BEGIN
  IF :NEW.emp_aut_id IS NULL THEN
    SELECT seq_emp_auth.NEXTVAL INTO :NEW.emp_aut_id FROM dual;
  END IF;
END;
/

-- emp_id, aut_id는 uq_emp_auth 복합 UNIQUE 인덱스로 커버됨


--------------------------------------------------------------------------
-- 7. 결재 양식
--------------------------------------------------------------------------
CREATE TABLE appr_form (
  for_id      NUMBER NOT NULL,
  com_id      NUMBER NOT NULL,
  for_code    VARCHAR2(50) NOT NULL,
  for_title   VARCHAR2(50) NOT NULL,
  for_content VARCHAR2(500) NOT NULL,
  for_status  NUMBER(1) NOT NULL,
  created_at  DATE DEFAULT SYSDATE NOT NULL,
  updated_at  DATE DEFAULT SYSDATE NOT NULL,
  CONSTRAINT pk_appr_form PRIMARY KEY (for_id), 
  CONSTRAINT uq_appr_form_com_code UNIQUE (com_id, for_code),
  CONSTRAINT fk_appr_form_company1
    FOREIGN KEY (com_id) REFERENCES company (com_id),
  CONSTRAINT chk_appr_form_status CHECK (for_status IN (0,1))
);

CREATE SEQUENCE appr_form_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER appr_form_trg
BEFORE INSERT ON appr_form
FOR EACH ROW
BEGIN
  IF :NEW.for_id IS NULL THEN
    SELECT appr_form_seq.NEXTVAL INTO :NEW.for_id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_appr_form_bu
BEFORE UPDATE ON appr_form
FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSDATE;
END;
/

-- com_id는 uq_appr_form_com_code로 커버됨


--------------------------------------------------------------------------
-- 8. 결재 문서
--------------------------------------------------------------------------
CREATE TABLE appr_doc (
  doc_id       NUMBER NOT NULL,
  emp_id       NUMBER NOT NULL,
  for_id       NUMBER NOT NULL,
  com_id       NUMBER NOT NULL,
  doc_title    VARCHAR2(100) NOT NULL,
  doc_content  CLOB NOT NULL,
  doc_status   VARCHAR2(20) DEFAULT 'WAI' NOT NULL,
  created_at   DATE DEFAULT SYSDATE NOT NULL,
  updated_at   DATE DEFAULT SYSDATE NOT NULL,
  is_important NUMBER(1) DEFAULT 0 NOT NULL, -- 0: 일반결재(3단계), 1: 중요문서(추가 결재라인)
  CONSTRAINT pk_appr_doc PRIMARY KEY (doc_id),
  CONSTRAINT ck_appr_doc_important CHECK (is_important IN (0,1)),
  CONSTRAINT ck_appr_doc_status CHECK (doc_status IN ('ING','APP','REJ','CAN')),
  CONSTRAINT fk_appr_doc_appr_form1
    FOREIGN KEY (for_id) REFERENCES appr_form (for_id),
  CONSTRAINT fk_appr_doc_company1
    FOREIGN KEY (com_id) REFERENCES company (com_id),
  CONSTRAINT fk_appr_doc_employee1
    FOREIGN KEY (emp_id) REFERENCES employee (emp_id)
);

CREATE SEQUENCE appr_doc_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER appr_doc_trg
BEFORE INSERT ON appr_doc
FOR EACH ROW
BEGIN
  IF :NEW.doc_id IS NULL THEN
    SELECT appr_doc_seq.NEXTVAL INTO :NEW.doc_id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_appr_doc_bu
BEFORE UPDATE ON appr_doc
FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSDATE;
END;
/

CREATE INDEX fk_appr_doc_appr_form1_idx ON appr_doc (for_id);
CREATE INDEX fk_appr_doc_company1_idx   ON appr_doc (com_id);
CREATE INDEX fk_appr_doc_employee1_idx  ON appr_doc (emp_id);


--------------------------------------------------------------------------
-- 9. 결재 라인
--------------------------------------------------------------------------
CREATE TABLE appr_line (
  lin_id       NUMBER NOT NULL,
  doc_id       NUMBER NOT NULL,
  emp_id       NUMBER NOT NULL,
  lin_order    NUMBER NOT NULL,
  lin_status   VARCHAR2(20) NOT NULL,
  lin_approved DATE NULL, -- 승인 시점에 UPDATE로 값 채움
  CONSTRAINT pk_appr_line PRIMARY KEY (lin_id),
  CONSTRAINT uq_appr_line_doc_order UNIQUE (doc_id, lin_order),
  CONSTRAINT ck_appr_line_status CHECK (lin_status IN ('NOT','WAI','APP','REJ')),
  CONSTRAINT fk_appr_line_appr_doc1
    FOREIGN KEY (doc_id) REFERENCES appr_doc (doc_id),
  CONSTRAINT fk_appr_line_employee1
    FOREIGN KEY (emp_id) REFERENCES employee (emp_id)
);

CREATE SEQUENCE appr_line_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER appr_line_trg
BEFORE INSERT ON appr_line
FOR EACH ROW
BEGIN
  IF :NEW.lin_id IS NULL THEN
    SELECT appr_line_seq.NEXTVAL INTO :NEW.lin_id FROM dual; -- (수정) appr_lin_seq -> appr_line_seq
  END IF;
END;
/

-- doc_id는 uq_appr_line_doc_order로 커버되며, emp_id만 별도 인덱스 필요
CREATE INDEX fk_appr_line_employee1_idx ON appr_line (emp_id);


--------------------------------------------------------------------------
-- 10. 프로젝트
--------------------------------------------------------------------------
CREATE TABLE project (
  pro_id      NUMBER NOT NULL,
  emp_id      NUMBER NOT NULL,
  com_id      NUMBER NOT NULL,
  pro_name    VARCHAR2(100) NOT NULL,
  pro_desc    VARCHAR2(1000),
  pro_status  VARCHAR2(20) DEFAULT 'TODO' NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE,
  created_at  DATE DEFAULT SYSDATE,
  updated_at  DATE DEFAULT SYSDATE,
  CONSTRAINT pk_project PRIMARY KEY (pro_id),
  CONSTRAINT ck_project_status CHECK (pro_status IN ('TODO','DOING','DONE')),
  CONSTRAINT fk_project_employee1 FOREIGN KEY (emp_id)
    REFERENCES employee (emp_id),
  CONSTRAINT fk_project_company1 FOREIGN KEY (com_id)
    REFERENCES company (com_id)
);

CREATE SEQUENCE seq_project START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_project_bi
BEFORE INSERT ON project
FOR EACH ROW
BEGIN
  IF :NEW.pro_id IS NULL THEN
    SELECT seq_project.NEXTVAL INTO :NEW.pro_id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_project_bu
BEFORE UPDATE ON project
FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSDATE;
END;
/

CREATE INDEX fk_project_employee1_idx ON project (emp_id);
CREATE INDEX fk_project_company1_idx  ON project (com_id);


--------------------------------------------------------------------------
-- 11. 프로젝트 멤버
--------------------------------------------------------------------------
CREATE TABLE project_member (
  pm_id          NUMBER NOT NULL,
  project_pro_id NUMBER NOT NULL,
  emp_id         NUMBER NOT NULL,
  member_role    VARCHAR2(50) NOT NULL, -- (수정) role -> member_role, ROLE은 Oracle 예약어
  joined_at      DATE NOT NULL,
  CONSTRAINT pk_project_member PRIMARY KEY (pm_id),
  CONSTRAINT uq_project_member UNIQUE (project_pro_id, emp_id),
  CONSTRAINT fk_project_member_project1
    FOREIGN KEY (project_pro_id) REFERENCES project (pro_id),
  CONSTRAINT fk_project_member_employee1
    FOREIGN KEY (emp_id) REFERENCES employee (emp_id)
);

CREATE SEQUENCE seq_project_member START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_project_member_bi
BEFORE INSERT ON project_member
FOR EACH ROW
BEGIN
  IF :NEW.pm_id IS NULL THEN
    SELECT seq_project_member.NEXTVAL INTO :NEW.pm_id FROM dual;
  END IF;
END;
/

-- project_pro_id는 uq_project_member로 커버되므로 emp_id만 추가
CREATE INDEX fk_project_member_employee1_idx ON project_member (emp_id);


--------------------------------------------------------------------------
-- 12. 태스크
--------------------------------------------------------------------------
CREATE TABLE task (
  task_id         NUMBER NOT NULL,
  pro_id          NUMBER NOT NULL,
  pm_id           NUMBER NOT NULL,
  com_id          NUMBER NOT NULL,
  task_name       VARCHAR2(100),
  task_desc       VARCHAR2(1000),
  task_status     VARCHAR2(20) DEFAULT 'TODO' NOT NULL,
  task_start_date DATE,
  task_end_date   DATE,
  created_at      DATE DEFAULT SYSDATE NOT NULL,
  updated_at      DATE DEFAULT SYSDATE NOT NULL,
  CONSTRAINT pk_task PRIMARY KEY (task_id),
  CONSTRAINT fk_task_project1 FOREIGN KEY (pro_id) REFERENCES project (pro_id),
  CONSTRAINT fk_task_company1 FOREIGN KEY (com_id) REFERENCES company (com_id),
  CONSTRAINT fk_task_project_member FOREIGN KEY (pm_id) REFERENCES project_member (pm_id),
  CONSTRAINT ck_task_status CHECK (task_status IN ('TODO','DOING','DONE'))
  -- (수정) pm_id_name(담당자명 중복 저장) 컬럼 삭제
  --        담당자명은 project_member -> employee 조인으로 조회
);

CREATE SEQUENCE seq_task START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_task_bi
BEFORE INSERT ON task
FOR EACH ROW
BEGIN
  IF :NEW.task_id IS NULL THEN
    SELECT seq_task.NEXTVAL INTO :NEW.task_id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_task_bu
BEFORE UPDATE ON task
FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSDATE;
END;
/

CREATE INDEX fk_task_project1_idx        ON task (pro_id);
CREATE INDEX fk_task_company1_idx        ON task (com_id);
CREATE INDEX fk_task_project_member_idx  ON task (pm_id);


--------------------------------------------------------------------------
-- 13. 전사 공지
--------------------------------------------------------------------------
CREATE TABLE notice (
  bno         NUMBER NOT NULL,
  emp_id      NUMBER NOT NULL,
  com_id      NUMBER NOT NULL,
  btitle      VARCHAR2(200) NOT NULL,
  bcontent    CLOB NOT NULL,
  bhit        NUMBER DEFAULT 0 NOT NULL,
  bfile       VARCHAR2(500),
  created_at  DATE DEFAULT SYSDATE NOT NULL,
  updated_at  DATE DEFAULT SYSDATE NOT NULL,
  CONSTRAINT pk_notice PRIMARY KEY (bno),
  CONSTRAINT fk_notice_employee1
    FOREIGN KEY (emp_id) REFERENCES employee (emp_id),
  CONSTRAINT fk_notice_company1
    FOREIGN KEY (com_id) REFERENCES company (com_id)
);

CREATE SEQUENCE seq_notice START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_notice_bi
BEFORE INSERT ON notice
FOR EACH ROW
BEGIN
  IF :NEW.bno IS NULL THEN
    SELECT seq_notice.NEXTVAL INTO :NEW.bno FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_notice_bu
BEFORE UPDATE ON notice
FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSDATE;
END;
/

CREATE INDEX fk_notice_employee1_idx ON notice (emp_id);
CREATE INDEX fk_notice_company1_idx  ON notice (com_id);

-- 참고: 첨부파일이 여러 개 필요해지면 notice_file(file_id, bno, file_name, file_path...)
--       테이블로 분리하는 걸 권장 (지금은 1건만 저장 가능한 구조)


--------------------------------------------------------------------------
-- 14. 자원
--------------------------------------------------------------------------
CREATE TABLE com_resource (
  res_id      NUMBER NOT NULL,
  com_id      NUMBER NOT NULL,
  res_code    VARCHAR2(50) NOT NULL,
  res_name    VARCHAR2(100) NOT NULL,
  res_type    VARCHAR2(20) NOT NULL,
  quantity    NUMBER NOT NULL,
  remark      VARCHAR2(255),
  created_at  DATE DEFAULT SYSDATE,
  updated_at  DATE DEFAULT SYSDATE,
  CONSTRAINT pk_resource PRIMARY KEY (res_id),
  CONSTRAINT uq_resource_com_code UNIQUE (com_id, res_code),
  CONSTRAINT ck_resource_type CHECK (res_type IN ('ROOM','EQUIPMENT')),
  CONSTRAINT ck_resource_qty CHECK (quantity >= 0),
  CONSTRAINT fk_resource_company1
    FOREIGN KEY (com_id) REFERENCES company (com_id)
);

CREATE SEQUENCE seq_resource START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_resource_bi
BEFORE INSERT ON resource
FOR EACH ROW
BEGIN
  IF :NEW.res_id IS NULL THEN
    SELECT seq_resource.NEXTVAL INTO :NEW.res_id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_resource_bu
BEFORE UPDATE ON resource
FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSDATE;
END;
/

-- com_id는 uq_resource_com_code로 커버됨


--------------------------------------------------------------------------
-- 15. 자원 예약
--------------------------------------------------------------------------
CREATE TABLE reservation (
  rev_id      NUMBER NOT NULL,
  res_id      NUMBER NOT NULL,
  com_id      NUMBER NOT NULL,
  emp_id      NUMBER NOT NULL,
  quantity    NUMBER NOT NULL,
  status      VARCHAR2(10) DEFAULT 'WAI' NOT NULL,
  req_date    DATE,
  remark      VARCHAR2(255),
  updated_at  DATE DEFAULT SYSDATE,
  CONSTRAINT pk_reservation PRIMARY KEY (rev_id),
  CONSTRAINT ck_reservation_status CHECK (status IN ('WAI','APP','REJ')),
  CONSTRAINT ck_reservation_qty CHECK (quantity > 0),
  CONSTRAINT fk_reservation_employee1
    FOREIGN KEY (emp_id) REFERENCES employee (emp_id),
  CONSTRAINT fk_reservation_company1
    FOREIGN KEY (com_id) REFERENCES company (com_id),
  CONSTRAINT fk_reservation_resource1
    FOREIGN KEY (res_id) REFERENCES com_resource (res_id)
);

CREATE SEQUENCE seq_reservation START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_reservation_bi
BEFORE INSERT ON reservation
FOR EACH ROW
BEGIN
  IF :NEW.rev_id IS NULL THEN
    SELECT seq_reservation.NEXTVAL INTO :NEW.rev_id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_reservation_bu
BEFORE UPDATE ON reservation
FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSDATE;
END;
/

CREATE INDEX fk_reservation_employee1_idx ON reservation (emp_id);
CREATE INDEX fk_reservation_company1_idx  ON reservation (com_id);
CREATE INDEX fk_reservation_resource1_idx ON reservation (res_id);

--------------------------------------------------------------------------
-- 끝
--------------------------------------------------------------------------
