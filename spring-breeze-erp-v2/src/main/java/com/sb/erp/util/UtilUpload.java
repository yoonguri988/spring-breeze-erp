package com.sb.erp.util;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

@Component
public class UtilUpload {
	@Value("${resource.path}") private String resourcePath; // C:/upload
	// import org.springframework.stereotype.Component;
	
	public String fileUpload(MultipartFile file) throws IOException {
		// 1. 파일 이름 중복 안되게
		UUID uid = UUID.randomUUID();
		String save = uid.toString()+"_"+file.getOriginalFilename();
		// 2. 파일 업로드
		File target = new File(resourcePath, save);
		FileCopyUtils.copy(file.getBytes(), target);
		return save;
	}
	
	//1. 업로드
	//   [팀미션] - 확장자, 용량, 사이즈 고려
	//2. [팀미션] - 글 삭제시 파일도 삭제
}
