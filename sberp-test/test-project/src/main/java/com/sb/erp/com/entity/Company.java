package com.sb.erp.com.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "company")
@Getter @Setter @NoArgsConstructor
public class Company {
    @Id @Column(name = "com_id")
    private Long comId;
    @Column(name = "com_name") 
    private String comName;
}
