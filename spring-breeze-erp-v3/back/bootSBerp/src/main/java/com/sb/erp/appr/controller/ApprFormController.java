package com.sb.erp.appr.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.appr.dto.request.ApprFormAiSchemaRequest;
import com.sb.erp.appr.dto.request.ApprFormRequest;
import com.sb.erp.appr.dto.request.ApprFormSearchCondition;
import com.sb.erp.appr.dto.response.ApprFormAiSchemaResponse;
import com.sb.erp.appr.dto.response.ApprFormListResponse;
import com.sb.erp.appr.dto.response.ApprFormResponse;
import com.sb.erp.appr.dto.response.CodeCheckResponse;
import com.sb.erp.appr.service.ApprFormService;
import com.sb.erp.com.dto.response.ComResponse;
import com.sb.erp.com.service.CompanyService;
import com.sb.erp.global.integration.OpenAiGpt;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/appr")
@RequiredArgsConstructor
public class ApprFormController {

	private final ApprFormService appr;
	private final CompanyService com; // 회사 검색
	private final OpenAiGpt gpt;
	
	// 양식 목록 조회 ( 검색 + 페이징 )
	@GetMapping
	public ResponseEntity<ApprFormListResponse> listForms(ApprFormSearchCondition condition){
		return ResponseEntity.ok(appr.listForms(condition));
	}
	
	// 양식 단건 조회 / 특정 버전
	@GetMapping("/{forId}/{forVersion}")
	public ResponseEntity<ApprFormResponse> getForm(
			@PathVariable Long forId,
			@PathVariable Long forVersion
	){
		return ResponseEntity.ok(appr.getForm(forId, forVersion));
	}
	
	// 특정 양식의 버전 전체 이력 조회
	@GetMapping("/{forId}/versions")
	public ResponseEntity<List<ApprFormResponse>> getFormVersions(@PathVariable Long forId){
		return ResponseEntity.ok(appr.getFormVersions(forId));
	}
	
	// 양식 등록
	@PostMapping
	public ResponseEntity<Void> insertForm(@Valid @RequestBody ApprFormRequest req){
		Long forId = appr.insertForm(req);
		
		// 신규 등록 버전은 무조건 1
		URI location = URI.create("/appr" + forId + "/1");
		return ResponseEntity.created(location).build();
	}
	
	// 양식 수정
	// 버전 증가 처리는 서비스 파트에서 처리
	@PutMapping("/{forId}/{forVersion}")
	public ResponseEntity<Void> updateForm(
			@PathVariable Long forId,
			@PathVariable Long forVersion,
			@Valid
			@RequestBody ApprFormRequest req
	){
		appr.updateForm(forId, forVersion, req);
		return ResponseEntity.noContent().build();
	}
	
	// 양식 삭제
	@DeleteMapping("/{forId}/{forVersion}")
	public ResponseEntity<Void> deleteForm(
			@PathVariable Long forId,
			@PathVariable Long forVersion
	){
		appr.deleteForm(forId, forVersion);
		return ResponseEntity.noContent().build();
	}
	
	// 양식 코드 중복 확인
	@GetMapping("/check-code")
	public ResponseEntity<CodeCheckResponse> checkCode(
			@RequestParam String forCode,
			@RequestParam Long comId,
			@RequestParam(required = false) Long forId
	){
		return ResponseEntity.ok(appr.checkCode(forCode, comId, forId));
	}
	
	// 회사 검색 ( 확인 필요함 )
	@GetMapping("/companies")
	public ResponseEntity<List<ComResponse>> searchCompany(@RequestParam String keyword){
		return ResponseEntity.ok(com.getSuggest(keyword));
	}
	
	// AI 기반 양식 스키마 생성
	
	@PostMapping("/ai-schema")
	public ResponseEntity<ApprFormAiSchemaResponse> generateSchema(
			@Valid
			@RequestBody ApprFormAiSchemaRequest req
	){
		try {
			String schemaJson = gpt.formSchema(req.getPrompt());
			return ResponseEntity.ok(ApprFormAiSchemaResponse.success(schemaJson));
		} catch (Exception e) {
			// 외부 API 호출 실패는 비즈니스 예외가 아니라 별개취급
			// -> 여기서만 예외적으로 캐치
			return ResponseEntity.ok(ApprFormAiSchemaResponse.fail("AI 양식 생성에 실패했습니다"));
		}
	}
}
