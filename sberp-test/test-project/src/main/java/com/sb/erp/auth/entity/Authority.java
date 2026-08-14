package com.sb.erp.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "authority")
@Getter @Setter @NoArgsConstructor
public class Authority {
    @Id @Column(name = "aut_id")
    private Long autId;
    @Column(name = "aut_name")
    private String autName;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "com_id")
    private com.sb.erp.com.entity.Company company;
}
