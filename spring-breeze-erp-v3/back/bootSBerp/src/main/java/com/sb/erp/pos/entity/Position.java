package com.sb.erp.pos.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 직급 Entity (emp_position 테이블)
 *
 * ── 설계 포인트 ──
 * 1. @Setter 없음 → 불변 객체 지향. 수정은 도메인 메서드(updateInfo)로만 허용.
 * 2. @NoArgsConstructor(access = PROTECTED) → JPA 프록시용 기본 생성자는 외부 호출 차단.
 * 3. @Builder → 생성 시 필요한 필드만 명시적으로 전달 (null 실수 방지).
 * 4. @SequenceGenerator → Oracle 시퀀스와 매핑. allocationSize=1로 nextval 호출 시마다 1씩 증가.
 * 5. comId는 Company Entity가 확정되면 @ManyToOne으로 전환 예정 (현재는 FK ID 유지).
 */
@Entity
@Table(name = "emp_position")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_emp_position")
    @SequenceGenerator(name = "seq_emp_position", sequenceName = "SEQ_EMP_POSITION", allocationSize = 1)
    @Column(name = "pos_id")
    private Integer posId;

    @Column(name = "pos_code", length = 20, nullable = false)
    private String posCode;

    @Column(name = "pos_name", length = 50, nullable = false)
    private String posName;

    @Column(name = "pos_order", nullable = false)
    private int posOrder;

    @Column(name = "com_id", nullable = false)
    private int comId;

    @Builder
    public Position(String posCode, String posName, int posOrder, int comId) {
        this.posCode = posCode;
        this.posName = posName;
        this.posOrder = posOrder;
        this.comId = comId;
    }

    // ── 도메인 메서드: 수정 가능 필드만 노출 ──
    public void updateInfo(String posCode, String posName, int posOrder) {
        this.posCode = posCode;
        this.posName = posName;
        this.posOrder = posOrder;
    }
}
