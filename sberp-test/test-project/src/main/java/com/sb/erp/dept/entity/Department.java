package com.sb.erp.dept.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "department")
@Getter @Setter @NoArgsConstructor
public class Department {
    @Id @Column(name = "dept_id")
    private Long deptId;
    @Column(name = "dept_name")
    private String deptName;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "com_id")
    private com.sb.erp.com.entity.Company company;
}
