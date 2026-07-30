package com.sb.erp.com.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.sb.erp.dept.entity.Department;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Company {
	@Id // jakarta.persistence.Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_company")
	@SequenceGenerator(name="seq_company", sequenceName="SEQ_COMPANY", allocationSize=1)
	@Column(name="COM_ID")
	private Long id;
	
	@Column(length = 100, nullable = false)
	private String industryGrpCode;
	@Column(length = 100, nullable = false)
	private String industryCode;
	@Column(length = 100, nullable = false)
	private String comName;
	@Column(length = 100, nullable = false)
	private String comCeo;
	@Column(length = 45, nullable = false)
	private String bizNo;
	
	@Column(length = 100)
	private String comTel;
	@Lob // 대용량 처리 - 이미지 
	private String comLogo;
		
	@Column(name="CREATED_AT", nullable=false)
	private LocalDateTime createdAt;
	@Column(name="UPDATED_AT", nullable=false)
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
	
	@OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
	@Builder.Default
	private List<Department> depts = new ArrayList<>();
	
//	@OneToMany(mappedBy = "company")
//	@Builder.Default
//	private List<Employee> employees = new ArrayList<>();
}
/*
 * COM_ID            NOT NULL NUMBER        
 * INDUSTRY_GRP_CODE NOT NULL VARCHAR2(100) 
 * INDUSTRY_CODE     NOT NULL VARCHAR2(100) 
 * COM_NAME          NOT NULL VARCHAR2(100) 
 * COM_CEO           NOT NULL VARCHAR2(100) 
 * BIZ_NO            NOT NULL VARCHAR2(45)  
 * COM_TEL                    VARCHAR2(100) 
 * COM_LOGO                   VARCHAR2(500) 
 * CREATED_AT        NOT NULL DATE          
 * UPDATED_AT        NOT NULL DATE    
 */
