package com.sb.erp.proj.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.emp.dto.response.EmpResponse;
import com.sb.erp.proj.dto.request.ProjRequest;
import com.sb.erp.proj.dto.request.ProjectSearchRequest;
import com.sb.erp.proj.dto.response.ProjResponse;
import com.sb.erp.proj.service.ProjectMemberService;
import com.sb.erp.proj.service.ProjectService;
import com.sb.erp.task.dto.request.TaskSearchRequest;
import com.sb.erp.task.service.TaskService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;


@Tag(name="Project Api", description = "Project 관련 Api")
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins="*")
public class ProjectController {
	private final ProjectService service;
	private final TaskService taskService;
	private final ProjectMemberService memberService;

	// 프로젝트 목록
	@Operation(summary = "프로젝트 목록 조회",description = "검색 조건에 맞는 프로젝트 목록 조회")
	@GetMapping
	public ResponseEntity<Map<String, Object>> getProjects(@ModelAttribute ProjectSearchRequest search) {

		List<ProjResponse> list = service.selectAll(search);

		Map<String, Object> result = new HashMap<>();
		result.put("list", list);
		return ResponseEntity.ok(result);
	}	
	
	// 사원 검색
	@Operation(summary = "사원 검색",description = "프로젝트 멤버 추가용 사원 검색")
	@GetMapping("/empSearch")
	public ResponseEntity<List<EmpResponse>> empSearch(@RequestParam("comId") Long comId,
            @RequestParam("keyword") String keyword){
		return ResponseEntity.ok(memberService.searchEmpForProject(comId, keyword));
	}
	
	// 프로젝트 등록
	@Operation(summary = "프로젝트 등록", description = "신규 프로젝트 등록")
	@PostMapping
	public ResponseEntity<Map<String, Object>> createProject(@RequestBody ProjRequest dto) {

		Map<String, Object> result = new HashMap<>();
		int insert = service.insert(dto);
		if (insert > 0) {
			result.put("success", true);
			result.put("message", "프로젝트 등록 성공");
			result.put("project", service.select(dto.getProId()));
			return ResponseEntity.status(HttpStatus.CREATED).body(result);
		}

		result.put("success", false);
		result.put("message", "프로젝트 등록 실패");
		return ResponseEntity.internalServerError().body(result);
	}
	
	// 프로젝트 상세조회
	@Operation(summary = "프로젝트 상세조회", description = "프로젝트 상세 + 태스크 목록 + 멤버 목록 조회")
	@GetMapping("/{proId}")
	public ResponseEntity<Map<String, Object>> getProjectDetail(@PathVariable("proId") Long proId){
		ProjResponse dto = service.select(proId);
		if (dto == null) {
			return ResponseEntity.notFound().build();
		}

	    TaskSearchRequest taskSearch = new TaskSearchRequest();
	    taskSearch.setProId(proId);
	    
	    Map<String, Object> result = new HashMap<>();
	    result.put("dto", dto);
	    result.put("list", taskService.selectAll(taskSearch));
	    result.put("memberList", memberService.select(proId));

	    return ResponseEntity.ok(result);
	}
	
	// 프로젝트 수정
	@Operation(summary = "프로젝트 수정", description = "프로젝트 정보를 수정")
	@PutMapping("/{proId}")
	public ResponseEntity<Map<String, Object>> updateProject(
			@PathVariable("proId") Long proId,
			@RequestBody ProjRequest dto) {
		dto.setProId(proId);
		Map<String, Object> result = new HashMap<>();

		int updated = service.edit(dto);
		if (updated > 0) {
			result.put("success", true);
			result.put("message", "프로젝트 수정 성공");
			return ResponseEntity.ok(result);
		}

		result.put("success", false);
		result.put("message", "해당 프로젝트를 찾을 수 없습니다.");
		return ResponseEntity.notFound().build();
	}

	// 프로젝트 삭제
	@Operation(summary = "프로젝트 삭제", description = "프로젝트를 삭제")
	@DeleteMapping("/{proId}")
	public ResponseEntity<Map<String, Object>> deleteProject(@PathVariable("proId") Long proId) {
		
		Map<String, Object> result = new HashMap<>();
		int deleted = service.delete(proId);

		if (deleted > 0) {
	        result.put("success", true);
	        result.put("message", "프로젝트 삭제 성공");
	        return ResponseEntity.ok(result);
	    }

	    result.put("success", false);
	    result.put("message", "프로젝트 삭제 실패");
	    return ResponseEntity.notFound().build();
	}
	
	// Ai 프로젝트 분석 결과
	@Operation(summary = "AI 프로젝트 분석", description = "프로젝트 리스크 분석 결과를 반환")
	@GetMapping("/{proId}/analysis")
	public ResponseEntity<String> analyzeProject(@PathVariable("proId") Long proId) {
	    return ResponseEntity.ok(service.analyzeProject(proId));
	}

}