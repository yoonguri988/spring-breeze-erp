package com.sb.erp.appr.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "appr_file")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprFile {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "appr_file_seq")
	@SequenceGenerator(name = "appr_file_seq", sequenceName = "appr_file_seq", allocationSize = 1)
	@Column(name = "file_id")
	private Long fileId;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "doc_id", nullable = false)
	private ApprDoc apprDoc;
	
	@Column(name = "orig_name", nullable = false, length = 255)
	private String origName;
	
	@Column(name = "saved_name", nullable = false, length = 255)
	private String savedName;
	
	@Column(name = "saved_path", nullable = false, length = 500)
	private String savedPath;
	
	@Column(name = "file_url", nullable = false, length = 500)
	private String fileUrl;
	
	@Column(name = "file_size", nullable = false)
	private Long fileSize;
	
	@Column(name = "content_type", length = 100)
	private String contentType;
	
	@Column(name = "created_at", nullable = false, insertable = false)
	private LocalDateTime createdAt;
}
