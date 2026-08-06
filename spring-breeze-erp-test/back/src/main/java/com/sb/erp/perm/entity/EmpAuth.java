package com.sb.erp.perm.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import com.sb.erp.emp.entity.Employee;

/**
 * 사원-권한 매핑 Entity (emp_auth 테이블)
 *
 * ── 왜 @ManyToMany가 아니라 별도 Entity인가 ──
 *
 * emp_auth 테이블에 독립 PK(emp_aut_id)가 있고,
 * 향후 부여일시, 부여자 등 추가 컬럼이 생길 수 있음.
 * @ManyToMany는 중간 테이블에 추가 컬럼을 넣을 수 없어서
 * 확장성을 위해 명시적 Entity로 매핑.
 *
 * ── 연관관계 ──
 * Employee ← @ManyToOne (권한 부여 대상 사원)
 * Authority ← @ManyToOne (부여된 권한)
 * 양방향은 현재 불필요 → 단방향으로 유지.
 */
@Entity
@Table(name = "emp_auth")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmpAuth {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_emp_auth")
    @SequenceGenerator(name = "seq_emp_auth", sequenceName = "SEQ_EMP_AUTH", allocationSize = 1)
    @Column(name = "emp_aut_id")
    private Integer empAutId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emp_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aut_id", nullable = false)
    private Authority authority;

    @Builder
    public EmpAuth(Employee employee, Authority authority) {
        this.employee = employee;
        this.authority = authority;
    }
}
