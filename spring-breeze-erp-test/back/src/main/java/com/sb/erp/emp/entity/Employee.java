package com.sb.erp.emp.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;



import com.sb.erp.pos.entity.Position;
import com.sb.erp.dept.entity.Department;
import com.sb.erp.com.entity.Company;


@Entity
@Table(name = "employee")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_employee")
    @SequenceGenerator(name = "seq_employee", sequenceName = "SEQ_EMPLOYEE", allocationSize = 1)
    @Column(name = "emp_id")
    private Long empId;

    @Column(name = "emp_no", length = 20, nullable = false)
    private String empNo;

    @Column(name = "emp_pass", length = 200, nullable = false)
    private String empPass;

    @Column(name = "emp_name", length = 50, nullable = false)
    private String empName;

    @Column(name = "emp_email", length = 100)
    private String empEmail;

    @Column(name = "emp_mobile", length = 20)
    private String empMobile;

    @Column(name = "emp_status", length = 10, nullable = false)
    private String empStatus;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    
    
    // ── 연관관계 ──

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pos_id", nullable = false)
    private Position position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dept_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "com_id", nullable = false)
    private Company company;

    @Builder
    public Employee(String empNo, String empPass, String empName,
                    String empEmail, String empMobile, String empStatus,
                    LocalDate hireDate, Position position,
                    Department department, Company company) {
        this.empNo = empNo;
        this.empPass = empPass;
        this.empName = empName;
        this.empEmail = empEmail;
        this.empMobile = empMobile;
        this.empStatus = empStatus;
        this.hireDate = hireDate;
        this.position = position;
        this.department = department;
        this.company = company;
    }

    
    // ── 도메인 메서드 ──

    /** 관리자용 사원 정보 수정 (부서, 직급, 상태 포함) */
    public void updateByAdmin(String empName, String empEmail, String empMobile,
                              String empStatus, Position position, Department department) {
        this.empName = empName;
        this.empEmail = empEmail;
        this.empMobile = empMobile;
        this.empStatus = empStatus;
        this.position = position;
        this.department = department;
    }

    /** 일반 사원 본인 정보 수정 (부서/직급/상태 변경 불가) */
    public void updateBySelf(String empName, String empEmail, String empMobile) {
        this.empName = empName;
        this.empEmail = empEmail;
        this.empMobile = empMobile;
    }

    /** 비밀번호 변경 (BCrypt 인코딩은 Service에서 처리 후 전달) */
    public void changePassword(String encodedPassword) {
        this.empPass = encodedPassword;
    }
}
