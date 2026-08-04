package com.sb.erp.appr.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "appr_form")
@IdClass(ApprFormId.class) // 복합 키
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprForm {
	
	@Id
	@Column(name = "for_id")
	private Long forId;
	
	@Id
	@Column(name = "for_version")
	private Long forVersion;
	
	@Column(name = "com_id", nullable = false)
	private Long comId;
	
	@Column(name = "for_code", nullable = false, length = 50)
	private String forCode;
	
	@Column(name = "for_title", nullable = false, length = 50)
	private String forTitle;
	
	@Lob
	@Column(name = "for_content")
	private String forContent;
	
	@Lob
	@Column(name = "for_schema")
	private String forSchema;
	
	@Column(name = "for_status", nullable = false)
	private Boolean forStatus;
	
	@Column(name = "is_deleted", nullable = false)
	private boolean isDeleted;
	
	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;
	
	@Column(name = "updated_at", nullable = false, updatable = false)
	private LocalDateTime updatedAt;
	
	@PrePersist
	void onCreated() {
		this.createdAt = LocalDateTime.now();
		this.updatedAt = LocalDateTime.now();
	}
}
		  