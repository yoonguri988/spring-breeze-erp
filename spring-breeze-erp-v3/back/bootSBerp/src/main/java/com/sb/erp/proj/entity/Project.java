package com.sb.erp.proj.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.sb.erp.com.entity.Company;
import com.sb.erp.emp.entity.Employee;

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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name="PROJECT")
public class Project {
	
	@Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "project_seq")
    @SequenceGenerator(name = "project_seq", sequenceName = "PROJECT_SEQ", allocationSize = 1)
	@Column(name="PRO_ID", nullable = false)
	private Long proId;
	
	@ManyToOne
	@JoinColumn(name="COM_ID", nullable = false)
	private Company company;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "EMP_ID", nullable = false)
	private Employee employee;
	
	@Column(name="PRO_STATUS", nullable = false, length=20)
	private String proStatus;
	
	@Column(name="PRO_NAME", nullable = false, length=100)
	private String proName;
	
	@Column(name="PRO_DESC", length=1000)
	private String proDesc;
	
	@Column(name="START_DATE", nullable = false)
	private LocalDate startDate;
	
	@Column(name="END_DATE", nullable = false)
	private LocalDate endDate;
	
	@Column(name="ACTUAL_START_DATE")
	private LocalDate actualStartDate; 
	
	@Column(name="ACTUAL_END_DATE")
	private LocalDate actualEndDate; 

	@Column(name="CREATED_AT")
	private LocalDateTime createdAt;
	
	@Column(name="UPDATED_AT")
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
	
//	@Column(name="EMP_NAME")
//	private String empName;
//	ㄴproject.getEmployee().getName()
//-- Repository --
//	@Query("SELECT COUNT(pm) FROM ProjectMember pm WHERE pm.project.id = :proId")
//	int countMembersByProjectId(@Param("proId") Long proId);
//	
//	@Column(name="MEMBERCNT")
//	private Integer memberCnt; 
	
}
