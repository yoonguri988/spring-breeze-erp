package com.sb.erp.appr.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.sb.erp.appr.dto.response.ApprFileResponse;

public interface ApprFileService {
	public List<ApprFileResponse> uploadFiles(Long docId, List<MultipartFile> files);
	public List<ApprFileResponse> selectFilesByDocId(Long docId);
	public void deleteFile(Long docId, Long fileId, Long empId);
}
