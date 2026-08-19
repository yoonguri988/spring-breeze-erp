package com.sb.erp.appr.dto.response;

import com.sb.erp.appr.entity.ApprFile;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ApprFileResponse {
	private Long fileId;
	private Long docId;
	private String origName;
	private String fileUrl;
	private Long fileSize;
	private String contentType;
	private String createdAt;
	
	public ApprFileResponse(ApprFile file) {
		this.fileId = file.getFileId();
		this.docId = file.getApprDoc().getDocId();
		this.origName = file.getOrigName();
		this.fileUrl = file.getFileUrl();
		this.fileSize = file.getFileSize();
		this.contentType = file.getContentType();
		this.createdAt = file.getCreatedAt() != null ? file.getCreatedAt().toString() : null;
	}
}
