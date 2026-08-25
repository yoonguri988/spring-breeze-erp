package com.sb.erp.rsm.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sb.erp.chunk.service.ResumeChunkService;
import com.sb.erp.rsm.dto.request.ResumeRequest;
import com.sb.erp.rsm.dto.response.ResumeResponse;
import com.sb.erp.rsm.service.ResumeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name="Resume Api", description = "이력서 업로드 api")
@RestController
@RequestMapping("/api/public/resume")
@RequiredArgsConstructor
public class ResumeController {
	
	private final ResumeService service;
	private final ResumeChunkService resumeChunkService;
	
	@Operation(summary = "이력서 업로드")
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResumeResponse> upload(@Parameter( content = @Content( mediaType = MediaType.APPLICATION_JSON_VALUE,
												schema = @Schema(implementation = ResumeRequest.class) )
            									)@Valid @RequestPart("request")ResumeRequest request,
												 @RequestPart("file")MultipartFile file){
		ResumeResponse response = service.upload(request, file);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
	

}
