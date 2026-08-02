package com.sb.erp.emp.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.sb.erp.com.entity.Company;
import com.sb.erp.dept.entity.Department;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "EMPLOYEE")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Employee {
	@Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_employee")
    @SequenceGenerator(name = "seq_employee", sequenceName = "SEQ_EMPLOYEE", allocationSize = 1)
    @Column(name = "EMP_ID", nullable = false)
    private Long empId;
	
	@Column(name = "EMP_NO", nullable = false, length = 20)
    private String empNo;
 
    @Column(name = "EMP_NAME", nullable = false, length = 50)
    private String empName;
 
    @Column(name = "EMP_PASS", nullable = false, length = 500)
    private String empPass;
 
    @Column(name = "EMP_EMAIL", nullable = false, length = 100)
    private String empEmail;
 
    @Column(name = "EMP_MOBILE", nullable = false, length = 20)
    private String empMobile;
 
    @Column(name = "EMP_STATUS", length = 10)
    private String empStatus; // 데이터 저장 한긅X -> 영문 지정
 
    @Column(name = "HIRE_DATE")
    private LocalDate hireDate;
 
    @Column(name = "CREATED_AT", nullable=false)
    private LocalDateTime createdAt;
 
    @Column(name = "UPDATED_AT", nullable=false)
    private LocalDateTime updatedAt;
    
	@PrePersist
	void onCreate() {
		this.createdAt = LocalDateTime.now();
		this.updatedAt = LocalDateTime.now();
	}
	@PreUpdate
	void onUpdate() {
		this.updatedAt = LocalDateTime.now();		
	}
	
	// 연관 관계
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COM_ID", nullable = false)
    private Company company;
	
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DEPT_ID", nullable = false)
    private Department department;
}
/*
EMP_ID     NOT NULL NUMBER(10)    
EMP_NO     NOT NULL VARCHAR2(20)  
EMP_NAME   NOT NULL VARCHAR2(50)  
EMP_PASS   NOT NULL VARCHAR2(500) 
EMP_EMAIL  NOT NULL VARCHAR2(100) 
EMP_MOBILE NOT NULL VARCHAR2(20)  
EMP_STATUS          VARCHAR2(10)  
HIRE_DATE           DATE          
CREATED_AT          DATE          
UPDATED_AT          DATE          
COM_ID     NOT NULL NUMBER(10)    
POS_ID     NOT NULL NUMBER(10)    
DEPT_ID    NOT NULL NUMBER(10)
*/