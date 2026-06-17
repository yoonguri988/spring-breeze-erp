create database if not exists `sb_erp_db`;


alter table company modify com_id INT auto_increment;
alter table department modify dept_id INT auto_increment;

CREATE TABLE IF NOT EXISTS `sb_erp_db`.`company` (
  `com_id` INT NOT NULL auto_increment,
  `indust_code` VARCHAR(100) NOT NULL,
  `indust_name` VARCHAR(100) NOT NULL,
  `com_name` VARCHAR(100) NOT NULL,
  `com_ceo` VARCHAR(100) NOT NULL,
  `biz_no` VARCHAR(45) NOT NULL,
  `com_tel` VARCHAR(100) NULL,
  `com_logo` VARCHAR(500) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`com_id`),
  UNIQUE INDEX `biz_no_UNIQUE` (`biz_no` ASC) VISIBLE)
;

CREATE TABLE IF NOT EXISTS `sb_erp_db`.`department` (
  `dept_id` INT NOT NULL auto_increment,
  `com_id` INT NOT NULL,
  `parent_id` INT NULL,
  `dept_name` VARCHAR(100) NULL,
  `dept_code` VARCHAR(100) NULL,
  `depth` INT NULL,
  `sort_order` INT NULL,
  `emp_id` INT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`dept_id`),
  INDEX `fk_department_company1_idx` (`com_id` ASC) VISIBLE,
  INDEX `fk_department_department1_idx` (`parent_id` ASC) VISIBLE,
  UNIQUE INDEX `com_dept_UNIQUE` (`com_id` ASC, `dept_code` ASC) INVISIBLE,
  CONSTRAINT `fk_department_company1`
    FOREIGN KEY (`com_id`)
    REFERENCES `sb_erp_db`.`company` (`com_id`)
    ON DELETE NO ACTION
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_department_department1`
    FOREIGN KEY (`parent_id`)
    REFERENCES `sb_erp_db`.`department` (`dept_id`)
    ON DELETE CASCADE
    ON UPDATE SET NULL)
;

CREATE TABLE IF NOT EXISTS `sb_erp_db`.`emp_position` (
  `pos_id` INT NOT NULL AUTO_INCREMENT,
  `com_id` INT NOT NULL,
  `pos_code` VARCHAR(20) NOT NULL,
  `pos_name` VARCHAR(20) NOT NULL,
  `pos_order` INT NOT NULL,
  INDEX `fk_emp_position_company1_idx` (`com_id` ASC) VISIBLE,
  PRIMARY KEY (`pos_id`),
  CONSTRAINT `fk_emp_position_company1`
    FOREIGN KEY (`com_id`)
    REFERENCES `sb_erp_db`.`company` (`com_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE TABLE IF NOT EXISTS `sb_erp_db`.`employee` (
  `emp_id` INT NOT NULL AUTO_INCREMENT,
  `com_id` INT NOT NULL,
  `pos_id` INT NOT NULL,
  `dept_id` INT NOT NULL,
  `emp_no` VARCHAR(20) NOT NULL,
  `emp_name` VARCHAR(50) NOT NULL,
  `emp_pass` VARCHAR(500) NOT NULL,
  `emp_email` VARCHAR(100) NOT NULL,
  `emp_mobile` VARCHAR(20) NOT NULL,
  `emp_status` VARCHAR(10) NULL DEFAULT '재직',
  `hire_date` DATE NULL,
  `created_at` DATETIME NULL DEFAULT current_timestamp,
  `updated_at` DATETIME NULL DEFAULT current_timestamp on update current_timestamp,
  PRIMARY KEY (`emp_id`),
  INDEX `fk_employee_company1_idx` (`com_id` ASC) VISIBLE,
  INDEX `fk_employee_emp_position1_idx` (`pos_id` ASC) VISIBLE,
  INDEX `fk_employee_department1_idx` (`dept_id` ASC) VISIBLE,
  CONSTRAINT `fk_employee_company1`
    FOREIGN KEY (`com_id`)
    REFERENCES `sb_erp_db`.`company` (`com_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_employee_emp_position1`
    FOREIGN KEY (`pos_id`)
    REFERENCES `sb_erp_db`.`emp_position` (`pos_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_employee_department1`
    FOREIGN KEY (`dept_id`)
    REFERENCES `sb_erp_db`.`department` (`dept_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE TABLE IF NOT EXISTS `sb_erp_db`.`authority` (
  `aut_id` INT NOT NULL auto_increment,
  `com_id` INT NOT NULL,
  `aut_name` VARCHAR(45) NULL,
  PRIMARY KEY (`aut_id`),
  INDEX `fk_authority_company1_idx` (`com_id` ASC) VISIBLE,
  CONSTRAINT `fk_authority_company1`
    FOREIGN KEY (`com_id`)
    REFERENCES `sb_erp_db`.`company` (`com_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE TABLE IF NOT EXISTS `sb_erp_db`.`emp_auth` (
  `emp_aut_id` INT NOT NULL auto_increment,
  `emp_id` INT NOT NULL,
  `aut_id` INT NOT NULL,
  PRIMARY KEY (`emp_aut_id`),
  INDEX `fk_emp_auth_employee1_idx` (`emp_id` ASC) VISIBLE,
  INDEX `fk_emp_auth_authority1_idx` (`aut_id` ASC) VISIBLE,
  CONSTRAINT `fk_emp_auth_employee1`
    FOREIGN KEY (`emp_id`)
    REFERENCES `sb_erp_db`.`employee` (`emp_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_emp_auth_authority1`
    FOREIGN KEY (`aut_id`)
    REFERENCES `sb_erp_db`.`authority` (`aut_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE TABLE IF NOT EXISTS `sb_erp_db`.`project` (
  `pro_id` INT NOT NULL AUTO_INCREMENT,
  `emp_id` INT NOT NULL,
  `com_id` INT NOT NULL,
  `pro_name` VARCHAR(100) NOT NULL,
  `pro_desc` VARCHAR(45) NOT NULL,
  `pro_status` VARCHAR(20) NOT NULL,
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`pro_id`),
  INDEX `fk_project_employee1_idx` (`emp_id` ASC) VISIBLE,
  INDEX `fk_project_company1_idx` (`com_id` ASC) VISIBLE,
  CONSTRAINT `fk_project_employee1`
    FOREIGN KEY (`emp_id`)
    REFERENCES `sb_erp_db`.`employee` (`emp_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_project_company1`
    FOREIGN KEY (`com_id`)
    REFERENCES `sb_erp_db`.`company` (`com_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE TABLE IF NOT EXISTS `sb_erp_db`.`project` (
  `pro_id` INT NOT NULL AUTO_INCREMENT,
  `emp_id` INT NOT NULL,
  `com_id` INT NOT NULL,
  `pro_name` VARCHAR(100) NOT NULL,
  `pro_desc` VARCHAR(45) NOT NULL,
  `pro_status` VARCHAR(20) NOT NULL,
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`pro_id`),
  INDEX `fk_project_employee1_idx` (`emp_id` ASC) VISIBLE,
  INDEX `fk_project_company1_idx` (`com_id` ASC) VISIBLE,
  CONSTRAINT `fk_project_employee1`
    FOREIGN KEY (`emp_id`)
    REFERENCES `sb_erp_db`.`employee` (`emp_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_project_company1`
    FOREIGN KEY (`com_id`)
    REFERENCES `sb_erp_db`.`company` (`com_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE TABLE IF NOT EXISTS `sb_erp_db`.`project_member` (
  `pm_id` INT NOT NULL AUTO_INCREMENT,
  `project_pro_id` INT NOT NULL,
  `emp_id` INT NOT NULL,
  `role` VARCHAR(45) NULL,
  `joined_at` DATETIME NOT NULL,
  PRIMARY KEY (`pm_id`),
  INDEX `fk_project_member_project1_idx` (`project_pro_id` ASC) VISIBLE,
  INDEX `fk_project_member_employee1_idx` (`emp_id` ASC) VISIBLE,
  CONSTRAINT `fk_project_member_project1`
    FOREIGN KEY (`project_pro_id`)
    REFERENCES `sb_erp_db`.`project` (`pro_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_project_member_employee1`
    FOREIGN KEY (`emp_id`)
    REFERENCES `sb_erp_db`.`employee` (`emp_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE TABLE IF NOT EXISTS `sb_erp_db`.`task` (
  `task_id` INT NOT NULL AUTO_INCREMENT,
  `pro_id` INT NOT NULL,
  `pm_id` INT NOT NULL,
  `com_id` INT NOT NULL,
  `task_name` VARCHAR(100) NOT NULL,
  `task_desc` VARCHAR(45) NOT NULL,
  `task_status` VARCHAR(20) NOT NULL,
  `pm_id_name` VARCHAR(50) NOT NULL,
  `task_start_date` DATETIME NOT NULL,
  `task_end_date` DATETIME NOT NULL,
  `task_created_at` DATETIME NOT NULL,
  `task_updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`task_id`),
  INDEX `fk_task_project1_idx` (`pro_id` ASC) VISIBLE,
  INDEX `fk_task_project_member1_idx` (`pm_id` ASC) VISIBLE,
  INDEX `fk_task_company1_idx` (`com_id` ASC) VISIBLE,
  CONSTRAINT `fk_task_project1`
    FOREIGN KEY (`pro_id`)
    REFERENCES `sb_erp_db`.`project` (`pro_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_task_project_member1`
    FOREIGN KEY (`pm_id`)
    REFERENCES `sb_erp_db`.`project_member` (`pm_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_task_company1`
    FOREIGN KEY (`com_id`)
    REFERENCES `sb_erp_db`.`company` (`com_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE TABLE IF NOT EXISTS `sb_erp_db`.`appr_form` (
  `for_id` INT NOT NULL AUTO_INCREMENT,
  `com_id` INT NOT NULL,
  `for_code` VARCHAR(50) NOT NULL,
  `for_title` VARCHAR(50) NOT NULL,
  `for_content` VARCHAR(500) NOT NULL,
  `for_status (boolean)` TINYINT NOT NULL,
  `for_created` DATETIME NOT NULL,
  `for_updated` DATETIME NOT NULL,
  PRIMARY KEY (`for_id`),
  INDEX `fk_appr_form_company1_idx` (`com_id` ASC) VISIBLE,
  CONSTRAINT `fk_appr_form_company1`
    FOREIGN KEY (`com_id`)
    REFERENCES `sb_erp_db`.`company` (`com_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;


CREATE TABLE IF NOT EXISTS `sb_erp_db`.`appr_doc` (
  `doc_id` INT NOT NULL AUTO_INCREMENT,
  `emp_id` INT NOT NULL,
  `for_id` INT NOT NULL,
  `com_id` INT NOT NULL,
  `doc_title` VARCHAR(100) NOT NULL,
  `doc_content` VARCHAR(1000) NOT NULL,
  `doc_status` VARCHAR(20) NOT NULL DEFAULT 'WAI',
  `doc_created` DATETIME NOT NULL,
  `doc_updated` DATETIME NOT NULL,
  PRIMARY KEY (`doc_id`),
  INDEX `fk_appr_doc_appr_form1_idx` (`for_id` ASC) VISIBLE,
  INDEX `fk_appr_doc_company1_idx` (`com_id` ASC) VISIBLE,
  INDEX `fk_appr_doc_employee1_idx` (`emp_id` ASC) VISIBLE,
  CONSTRAINT `fk_appr_doc_appr_form1`
    FOREIGN KEY (`for_id`)
    REFERENCES `sb_erp_db`.`appr_form` (`for_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_appr_doc_company1`
    FOREIGN KEY (`com_id`)
    REFERENCES `sb_erp_db`.`company` (`com_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_appr_doc_employee1`
    FOREIGN KEY (`emp_id`)
    REFERENCES `sb_erp_db`.`employee` (`emp_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE TABLE IF NOT EXISTS `sb_erp_db`.`appr_line` (
  `lin_id` INT NOT NULL,
  `doc_id` INT NOT NULL,
  `emp_id` INT NOT NULL,
  `lin_order` INT NOT NULL,
  `lin_status` VARCHAR(20) NOT NULL,
  `lin_approved` DATETIME NULL,
  PRIMARY KEY (`lin_id`),
  INDEX `fk_appr_line_appr_doc1_idx` (`doc_id` ASC) VISIBLE,
  INDEX `fk_appr_line_employee1_idx` (`emp_id` ASC) VISIBLE,
  CONSTRAINT `fk_appr_line_appr_doc1`
    FOREIGN KEY (`doc_id`)
    REFERENCES `sb_erp_db`.`appr_doc` (`doc_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_appr_line_employee1`
    FOREIGN KEY (`emp_id`)
    REFERENCES `sb_erp_db`.`employee` (`emp_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;


CREATE TABLE IF NOT EXISTS `sb_erp_db`.`notice` (
  `bno` INT NOT NULL AUTO_INCREMENT,
  `emp_id` INT NOT NULL,
  `com_id` INT NOT NULL,
  `btitle` VARCHAR(200) NOT NULL,
  `bcontent` VARCHAR(1000) NOT NULL,
  `bhit` INT NOT NULL DEFAULT 0,
  `bfile` VARCHAR(500) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`bno`),
  INDEX `fk_notice_employee1_idx` (`emp_id` ASC) VISIBLE,
  INDEX `fk_notice_company1_idx` (`com_id` ASC) VISIBLE,
  CONSTRAINT `fk_notice_employee1`
    FOREIGN KEY (`emp_id`)
    REFERENCES `sb_erp_db`.`employee` (`emp_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_notice_company1`
    FOREIGN KEY (`com_id`)
    REFERENCES `sb_erp_db`.`company` (`com_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


CREATE TABLE IF NOT EXISTS `sb_erp_db`.`resource` (
  `res_id` INT NOT NULL AUTO_INCREMENT,
  `com_id` INT NOT NULL,
  `res_code` VARCHAR(50) NOT NULL,
  `res_name` VARCHAR(100) NOT NULL,
  `res_type` ENUM('Romm') NOT NULL,
  `quantity` INT NOT NULL,
  `remark` VARCHAR(255) NULL,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`res_id`),
  INDEX `fk_resource_company1_idx` (`com_id` ASC) VISIBLE,
  CONSTRAINT `fk_resource_company1`
    FOREIGN KEY (`com_id`)
    REFERENCES `sb_erp_db`.`company` (`com_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;


CREATE TABLE IF NOT EXISTS `sb_erp_db`.`reservation` (
  `rev_id` INT NOT NULL AUTO_INCREMENT,
  `res_id` INT NOT NULL,
  `com_id` INT NOT NULL,
  `emp_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `status` ENUM('WAI', 'APP', 'REJ') NOT NULL,
  `req_date` DATETIME NULL,
  `remark` VARCHAR(255) NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`rev_id`),
  INDEX `fk_reservation_employee1_idx` (`emp_id` ASC) VISIBLE,
  INDEX `fk_reservation_company1_idx` (`com_id` ASC) VISIBLE,
  INDEX `fk_reservation_resource1_idx` (`res_id` ASC) VISIBLE,
  CONSTRAINT `fk_reservation_employee1`
    FOREIGN KEY (`emp_id`)
    REFERENCES `sb_erp_db`.`employee` (`emp_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_reservation_company1`
    FOREIGN KEY (`com_id`)
    REFERENCES `sb_erp_db`.`company` (`com_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_reservation_resource1`
    FOREIGN KEY (`res_id`)
    REFERENCES `sb_erp_db`.`resource` (`res_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;