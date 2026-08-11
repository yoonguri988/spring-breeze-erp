package com.sb.erp.com.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sb.erp.com.dto.request.ComRequest;
import com.sb.erp.com.dto.request.CompanySearchRequest;
import com.sb.erp.com.dto.response.ComDetailResponse;
import com.sb.erp.com.dto.response.ComResponse;
import com.sb.erp.com.dto.response.StatsComResponse;
import com.sb.erp.com.service.CompanyService;
import com.sb.erp.dept.service.DeptService;
import com.sb.erp.emp.dto.request.EmpRequest;
import com.sb.erp.emp.service.EmpService;
import com.sb.erp.global.exception.FileUploadException;
import com.sb.erp.global.oauth2.CustomUserPrincipal;
import com.sb.erp.global.security.JwtProperties;
import com.sb.erp.global.security.JwtProvider;
import com.sb.erp.global.security.TokenStore;
import com.sb.erp.util.dto.FileUploadDto;
import com.sb.erp.util.dto.FileUploadType;
import com.sb.erp.util.dto.FileUploadUtil;
import com.sb.erp.util.dto.ListResponse;
import com.sb.erp.util.dto.PagingUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Company REST API", description = "회사 관리 REST API")
@RestController
@RequestMapping("/api/com")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CompanyController {

	@Autowired CompanyService service;
	@Autowired EmpService empService;
	@Autowired DeptService deptService;
	
	private final JwtProperties props;      // JWT 출입증 (설정값)      
	private final JwtProvider jwtProvider;  // JWT 토근생성/검증 ( access Token / refresh Token )
	private final TokenStore tokenStore;	// JMT 저장소

	// 회사 등록 기능 POST /api/com
	@Operation(summary = "회사 등록", description = "새로운 회사를 등록합니다. 사업자등록번호는 중복될 수 없습니다. ADMIN 또는 ROOT 권한이 필요합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "201", description = "회사 등록 성공"),
			@ApiResponse(responseCode = "400", description = "유효성 검증 실패(필수값 누락, 사업자번호 형식 오류) 또는 사업자번호 중복"),
			@ApiResponse(responseCode = "403", description = "권한 없음 (ADMIN/ROOT만 가능)") })
//	@PreAuthorize("hasRole('ADMIN') or hasAuthority('ROOT')")
	@PostMapping
	public ResponseEntity<?> add(
			@io.swagger.v3.oas.annotations.parameters.RequestBody(description = "등록할 회사 정보 (사업자번호 형식: 000-00-00000)", required = true) @Valid @RequestBody ComRequest dto) {
		try {
			int result = service.add(dto);
			if (result > 0) {
				return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "회사 등록에 성공하였습니다."));
			}
			return ResponseEntity.badRequest().body(Map.of("message", "회사 등록에 실패하였습니다."));
		} catch (IllegalArgumentException e) {
			// 사업자등록번호 중복 등 비즈니스 검증 실패
			return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
		}
	}

	// 회사 단건 조회 GET /api/com/{comId}
	// * ComDetailResponse는 필수 아님 - 회사정보/부서통계/조직도를 한 화면에서 같이 써야 해서 조합용으로 사용.
	@Operation(summary = "회사 상세 조회", description = "회사 ID로 회사 정보 + 부서 통계/조직도를 조회합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "조회 성공"),
			@ApiResponse(responseCode = "404", description = "존재하지 않는 회사 ID") })
	@GetMapping("/{comId}")
	public ResponseEntity<ComDetailResponse> detail(
			@Parameter(description = "조회할 회사 ID", example = "1", required = true) @PathVariable("comId") long comId) {

		ComResponse com = service.selectOneById(comId);

		ComDetailResponse response = ComDetailResponse.builder().com(com).deptStats(deptService.selectStats(comId))
				.deptList(deptService.selectOrgTree(comId)).build();

		return ResponseEntity.ok(response);
	}

	// 회사 목록 조회 GET /api/com
	@Operation(summary = "회사 목록 조회", description = "검색조건(키워드, 업종 대분류 등)에 맞는 회사 목록을 페이징하여 조회합니다. ADMIN 또는 ROOT 권한이 필요합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "조회 성공 (검색조건이 없으면 빈 목록 반환)"),
			@ApiResponse(responseCode = "403", description = "권한 없음 (ADMIN/ROOT만 가능)") })
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('ROOT')")
	@GetMapping
	public ResponseEntity<ListResponse<ComResponse>> list(
			@Parameter(description = "검색조건 (keyword, industryGrpCode, pstartno, onepagelist 등)") @ModelAttribute CompanySearchRequest search) {

		boolean isEmpty = !search.hasSearchCondition();
		int listTotal = isEmpty ? 0 : service.listTotal(search);

		PagingUtil paging = isEmpty ? new PagingUtil(0, search.getPstartno())
				: new PagingUtil(listTotal, search.getPstartno(), search.getOnepagelist(), 10);

		List<ComResponse> items = isEmpty ? List.of() : service.list(search);

		ListResponse<ComResponse> response = ListResponse.<ComResponse>builder().paging(paging).items(items).build();

		return ResponseEntity.ok(response);
	}

	// 회사 수정 PUT /api/com/{comId}
	@Operation(summary = "회사 수정", description = "회사 정보를 수정합니다. 로고 URL을 새로 안 보내면 기존 로고가 유지됩니다. ADMIN 또는 ROOT 권한이 필요합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "수정 성공"),
			@ApiResponse(responseCode = "400", description = "유효성 검증 실패 또는 수정 실패"),
			@ApiResponse(responseCode = "403", description = "권한 없음 (ADMIN/ROOT만 가능)"),
			@ApiResponse(responseCode = "404", description = "존재하지 않는 회사 ID") })
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('ROOT')")
	@PutMapping("/{comId}")
	public ResponseEntity<?> update(
			@Parameter(description = "수정할 회사 ID", example = "1", required = true) @PathVariable("comId") long comId,
			@io.swagger.v3.oas.annotations.parameters.RequestBody(description = "수정할 회사 정보", required = true) @Valid @RequestBody ComRequest dto) {

		ComResponse before = service.selectOneById(comId);
		if (before == null) {
			return ResponseEntity.notFound().build();
		}

		dto.setComId(comId);
		// 로고를 별도 업로드 API(/logo)로 먼저 올린 뒤 URL을 dto.comLogo에 담아 보내는 방식이므로,
		// 새 로고 URL이 없으면 기존 값을 유지한다.
		if (dto.getComLogo() == null || dto.getComLogo().isBlank()) {
			dto.setComLogo(before.getComLogo());
		}

		int result = service.update(dto);
		if (result > 0) {
			// 로고가 교체된 경우에만 기존 파일 정리
			if (before.getComLogo() != null && !before.getComLogo().equals(dto.getComLogo())) {
				FileUploadUtil.delete(before.getComLogo());
			}
			return ResponseEntity.ok(Map.of("message", "회사 정보 수정에 성공하였습니다."));
		}
		return ResponseEntity.badRequest().body(Map.of("message", "회사 정보 수정에 실패하였습니다."));
	}

	// 회사 삭제 DELETE /api/com/{comId}
	// empService.matchPassword
	@Operation(summary = "회사 삭제", description = "회사를 삭제합니다. 요청자 본인의 비밀번호 확인이 필요하며, ROOT 권한만 가능합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "삭제 성공"),
			@ApiResponse(responseCode = "400", description = "비밀번호 불일치 또는 하위 부서 존재 등 삭제 불가"),
			@ApiResponse(responseCode = "403", description = "권한 없음 (ROOT만 가능)") })
	@PreAuthorize("hasAuthority('ROOT')")
	@DeleteMapping("/{comId}")
	public ResponseEntity<?> delete(
			@Parameter(description = "삭제할 회사 ID", example = "1", required = true) @PathVariable("comId") long comId,
			@Parameter(description = "요청자 본인 확인용 비밀번호", required = true) @RequestParam("password") String password,
			@Parameter(hidden = true) @AuthenticationPrincipal CustomUserPrincipal principal) {
		EmpRequest dto = new EmpRequest();
		dto.setEmpId(principal.getEmpId());
		dto.setEmpPass(password);
		
		boolean matched = empService.matchPassword(dto);
		if (!matched) {
			return ResponseEntity.badRequest().body(Map.of("message", "비밀번호가 올바르지 않습니다."));
		}

		try {
			service.delete(comId);
			return ResponseEntity.ok(Map.of("message", "회사가 삭제되었습니다."));
		} catch (IllegalArgumentException e) {
			// 하위 부서 존재 등 비즈니스 로직 검증 실패
			return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
		}
	}

	// 사업자 중복 체크 GET /api/com/check-bizno
	@Operation(summary = "사업자번호 중복확인", description = "사업자등록번호 중복 여부를 확인합니다.")
	@ApiResponse(responseCode = "200", description = "확인 성공 (duplicate: true/false)")
	@GetMapping("/check-bizno")
	public ResponseEntity<Map<String, Object>> checkBizNo(
			@Parameter(description = "확인할 사업자등록번호", example = "123-45-67890", required = true) @RequestParam("bizNo") String bizNo) {

		boolean duplicate = service.isDuplicateBizNo(bizNo) != null;
		return ResponseEntity.ok(Map.of("duplicate", duplicate));
	}

	// 회사명 자동완성 GET /api/com/suggest
	@Operation(summary = "회사명 자동완성", description = "키워드로 회사명 상위 5건을 조회합니다.")
	@ApiResponse(responseCode = "200", description = "조회 성공")
	@GetMapping("/suggest")
	public ResponseEntity<List<ComResponse>> suggest(
			@Parameter(description = "검색 키워드 (회사명 일부)", example = "위세", required = true) @RequestParam("keyword") String keyword) {

		return ResponseEntity.ok(service.getSuggest(keyword));
	}

	// 회사 통계 조회 GET /api/com/stats
	@Operation(summary = "회사 통계 조회", description = "전체 회사수/임직원수/업종수 등 통계를 조회합니다.")
	@ApiResponse(responseCode = "200", description = "조회 성공")
	@GetMapping("/stats")
	public ResponseEntity<StatsComResponse> stats() {
		return ResponseEntity.ok(service.selectStats());
	}

	// 회사 로고 업로드 POST /api/com/logo
	// 업로드 전용 API - 프론트에서 먼저 호출해 URL을 받은 뒤,
	// 그 URL을 등록/수정 요청의 ComRequest.comLogo 에 담아서 보낸다
	@Operation(summary = "회사 로고 업로드", description = "로고 이미지를 업로드하고 접근 가능한 URL을 반환합니다. 등록/수정 요청 전에 먼저 호출해서 URL을 받아야 합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "업로드 성공 (fileUrl 등 반환)"),
			@ApiResponse(responseCode = "400", description = "업로드 실패 (파일 형식/용량 초과 등)") })
	@PostMapping(value = "/logo", consumes = "multipart/form-data")
	public ResponseEntity<?> uploadLogo(
			@Parameter(description = "업로드할 회사 로고 이미지 파일", required = true) @RequestPart(name = "logoFile") MultipartFile logoFile) {
		try {
			FileUploadDto result = FileUploadUtil.upload(logoFile, FileUploadType.COMPANY_LOGO);
			return ResponseEntity.ok(result); // fileUrl 등 업로드 결과 반환
		} catch (FileUploadException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// 내 회사 정보 조회 GET /api/com/my
	// JwtAuthenticationFilter가 SecurityContext에 세팅한 CustomUserPrincipal에서
	// empId/comId를 바로 꺼내 쓴다
	@Operation(summary = "내 회사 정보 조회", description = "로그인한 사용자가 소속된 회사 정보 + 부서 통계/조직도를 조회합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "조회 성공"),
			@ApiResponse(responseCode = "401", description = "인증되지 않은 요청") })
	@GetMapping("/my")
	public ResponseEntity<ComDetailResponse> my(
			@Parameter(hidden = true) @AuthenticationPrincipal CustomUserPrincipal principal) {

		long comId = principal.getComId();

		ComDetailResponse response = ComDetailResponse.builder().com(service.selectOneByEmpId(principal.getEmpId()))
				.deptStats(deptService.selectStats(comId)).deptList(deptService.selectOrgTree(comId)).build();

		return ResponseEntity.ok(response);
	}
}