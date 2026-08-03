package com.sb.erp.task.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.sb.erp.com.entity.Company;
import com.sb.erp.proj.entity.Project;
import com.sb.erp.proj.entity.ProjectMember;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name="TASK")
public class Task {
	@Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "task_seq")
    @SequenceGenerator(name = "task_seq", sequenceName = "TASK_SEQ", allocationSize = 1)
	@Column(name="TASK_ID", nullable = false)
	private Integer taskId;
	
	@ManyToOne
	@JoinColumn(name="PRO_ID", nullable = false)
	private Project project;

	@ManyToOne
	@JoinColumn(name="PM_ID", nullable = false)
	private ProjectMember projectMember;

	@ManyToOne
	@JoinColumn(name="COM_ID", nullable = false)
	private Company company;
	
	@Column(name="PARENT_TASK_ID")
	private Integer parentTaskId;
	
	@Column(name="TASK_NAME", length=100)
	private String taskName;
	
	@Column(name="TASK_DESC", length=1000)
	private String taskDesc;
	
	@Column(name="TASK_STATUS", nullable = false, length=20)
	private String taskStatus;

	@Column(name="TASK_START_DATE", nullable = false)
	private LocalDate taskStartDate;
	
	@Column(name="TASK_END_DATE", nullable = false)
	private LocalDate taskEndDate;
	
	@Column(name="ACTUAL_START_DATE")
	private LocalDate actualStartDate; // 실제 착수일
	
	@Column(name="ACTUAL_END_DATE")
	private LocalDate actualEndDate; //실제 완요일
	
	@Column(name="CREATED_AT", nullable = false)
	private LocalDateTime createdAt;
	
	@Column(name="UPDATED_AT", nullable = false)
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

}
