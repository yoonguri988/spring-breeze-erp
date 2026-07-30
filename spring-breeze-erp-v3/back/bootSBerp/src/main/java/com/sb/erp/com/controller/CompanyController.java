package com.sb.erp.com.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sb.erp.com.dto.CompanyDto.CompanyRequestDto;
import com.sb.erp.com.dto.CompanyDto.CompanyResponseDto;
import com.sb.erp.com.dto.CompanySearchDto;
import com.sb.erp.com.dto.StatsComDto;
import com.sb.erp.com.service.CompanyService;
import com.sb.erp.global.exception.FileUploadException;
import com.sb.erp.util.dto.FileUploadDto;
import com.sb.erp.util.dto.FileUploadType;
import com.sb.erp.util.dto.FileUploadUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * 회사(Company) 관리 REST API
 * 기존 Thymeleaf 뷰 반환 방식(CompanyController)을 JSON 기반 REST API로 전환한 컨트롤러입니다.
 * 실제 서비스 로직(CompanyService)의 상세 구현/시그니처는 그대로 재사용하되,
 * 파라미터/리턴 타입만 Request/Response DTO 기준으로 맞춰서 호출합니다.
 * ※ CompanyService 쪽 메서드 시그니처도 아래 DTO에 맞춰 함께 조정이 필요합니다.
 */


@Tag(name="Company REST API", description = "회사 관리 REST API")
@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
@CrossOrigin(origins="*")
public class CompanyController {
	@Autowired CompanyService service;
//	private final EmpService empService;
	//private final PermService permService;
//	private final DeptService deptService;
	
	// 회사 등록 기능 POST  /api/company
	@Operation(summary = "회사 등록", description = "새로운 회사를 등록합니다.")
	@PostMapping
	public ResponseEntity<CompanyResponseDto> createCompany(@RequestBody CompanyRequestDto requestDto) {
		CompanyResponseDto response = service.createCompany(requestDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(response); // 201
	}
	
	// 회사 단건 조회 GET /api/company/{id}
	@Operation(summary = "회사 단건 조회", description = "회사 ID로 특정 회사 정보를 조회합니다.")
	@GetMapping("/{id}")
	public ResponseEntity<CompanyResponseDto> getCompany(@PathVariable("id") Long id) {
		CompanyResponseDto response = service.getCompany(id);
		return ResponseEntity.ok(response); // 200
	}
	
	// 회사 목록 조회 (검색 + 페이징) GET  /api/company/search=?
	@Operation(summary = "회사 목록 조회", description = "검색조건에 맞는 회사 목록을 조회합니다.")
	@GetMapping
	public ResponseEntity<List<CompanyResponseDto>> getCompanies(CompanySearchDto search) {
		return ResponseEntity.ok(service.getAllCompanies(search));
	}
	
	// 회사 수정 PUT /api/company/{id}
	@Operation(summary = "회사 수정", description = "회사 정보를 수정합니다.")
	@PutMapping("/{id}")
	public ResponseEntity<CompanyResponseDto> updateCompany(@PathVariable("id") Long id,
			@RequestBody CompanyRequestDto requestDto) {
		return ResponseEntity.ok(service.updateCompany(id, requestDto));
	}
	
	// 회사 삭제 DELETE /api/company/{id}
	@Operation(summary = "회사 삭제", description = "회사를 삭제합니다.")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteCompany(@PathVariable("id") Long id) {
		service.deleteCompany(id);
		return ResponseEntity.noContent().build(); // 204
	}
	
	// 사업자 중복 체크 GET /api/company/check-bizno
	@Operation(summary = "사업자번호 중복확인", description = "사업자등록번호 중복 여부를 확인합니다.")
	@GetMapping("/check-bizno")
	public ResponseEntity<Boolean> checkBizNo(@RequestParam("bizNo") String bizNo) {
		return ResponseEntity.ok(service.checkBizNo(bizNo));
	}
	
	// 회사명 자동완성 GET /api/company/suggest
	@Operation(summary = "회사명 자동완성", description = "키워드로 회사명 상위 5건을 조회합니다.")
	@GetMapping("/suggest")
	public ResponseEntity<List<CompanySearchDto>> suggest(@RequestParam("keyword") String keyword) {
		return ResponseEntity.ok(service.getSuggest(keyword));
	}
	
	// 회사 통계 조회 GET /api/company/stats
	@Operation(summary = "회사 통계 조회", description = "전체 회사수/임직원수/업종수 등 통계를 조회합니다.")
	@GetMapping("/stats")
	public ResponseEntity<StatsComDto> getStats() {
		return ResponseEntity.ok(service.getStats());
	}	
	
	// 회사 로고 업로드 POST  /api/company/logo
	// 업로드 전용 API - 프론트에서 먼저 호출해 URL을 받은 뒤,
	// 그 URL을 등록/수정 요청의 CompanyRequestDto.comLogo 에 담아서 보낸다)
	@Operation(summary = "회사 로고 업로드", description = "로고 이미지를 업로드하고 접근 가능한 URL을 반환합니다.")
	@PostMapping(value = "/logo", consumes = "multipart/form-data")
	public ResponseEntity<?> uploadLogo(@RequestParam("logoFile") MultipartFile logoFile) {
		try {
			FileUploadDto result = FileUploadUtil.upload(logoFile, FileUploadType.COMPANY_LOGO);
			return ResponseEntity.ok(result); // fileUrl 등 업로드 결과 반환
		} catch (FileUploadException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	// 회사 상세 조회는 department 도메인 완성 전까지는 /{id} 단건조회와 내용이 완전히 같으므로
	// 별도 엔드포인트로 분리하지 않는다. (deptStats/deptList가 채워질 때 아래처럼 확장 예정)
	//
	// @Operation(summary = "회사 상세 조회", description = "회사 정보 + 부서 통계/조직도를 조회합니다.")
	// @GetMapping("/{id}/detail")
	// public ResponseEntity<CompanyDetailResponse> getCompanyDetail(@PathVariable("id") Long id) {
	// 	CompanyResponseDto company = companyService.getCompany(id);
	// 	StatsDeptDto deptStats = deptService.selectStats(id);
	// 	List<DeptDto> deptList = deptService.selectOrgTree(id);
	// 	return ResponseEntity.ok(new CompanyDetailResponse(company, deptStats, deptList));
	// }
	
	// 내 회사 정보 조회 (로그인한 사용자 소속 회사 + 부서 통계/조직도) - 부서 통계/조직도는 추후 추가 예정
//	@Operation(summary = "내 회사 정보 조회", description = "로그인한 사용자가 소속된 회사 정보를 조회합니다.") // swagger
//	@GetMapping("/my")
//	public ResponseEntity<CompanyDetailResponse> getMyCompany(@AuthenticationPrincipal CustomUserDetails userDetails) {
//		if (userDetails == null) {
//			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//		}
// 
//		Long comId = userDetails.getComId(); // TODO: 실제 필드/메서드명에 맞게 수정
//		CompanyResponseDto company = companyService.getCompany(comId);
// 
//		// StatsDeptDto deptStats = deptService.selectStats(comId);
//		// List<DeptDto> deptList = deptService.selectOrgTree(comId);
// 
//		return ResponseEntity.ok(new CompanyDetailResponse(company, null, null));
//	}

	
	
	// 회사 사업자 번호 중복 체크 (ajax)
//	@GetMapping("/checkBizNo")
//	@ResponseBody
//	//@PreAuthorize("hasRole('ADMIN') or hasAuthority('ROOT')")
//	public Map<String, Object> checkBizNo(String bizNo){
//		Map<String, Object> res = new HashMap<>();
//		CompanyDto dto = service.isDuplicateBizNo(bizNo);
//		
//		if(dto != null) res.put("duplicate", true);
//		else res.put("duplicate", false);
//		
//		return res;
//	}
//	
//	// 회사 목록 조회
//	@GetMapping("/list")
//	//@PreAuthorize("hasRole('ADMIN') or hasAuthority('ROOT')")
//	public String list(ComSearchDto search, Model model, Authentication auth) {
//		if (!SecurityUtil.isAdminOrRoot(auth)) {
//	        return "redirect:/com/my";
//	    }
//		
//		int listtotal = service.listTotal(search);
//		// 검색 조건이 null
//		boolean isEmpty = !search.hasSearchCondition();
//		
//		List<CompanyDto> list = new ArrayList<>();
//		PagingUtil paging;
//		
//		if(isEmpty) {
//	    	paging = new PagingUtil(0, search.getPstartno());
//		}else {
//			paging = new PagingUtil(listtotal, search.getPstartno(), search.getOnepagelist(), 10);
//			list = service.list(search);
//		}
//		
//		//통계 데이터
//		StatsComDto stats = service.selectStats();
//		model.addAttribute("stats", stats);
//		model.addAttribute("paging", paging);
//		model.addAttribute("items", list);
//		return "/com/list";
//	}
//	
//	// 검색 조회 목록 상위 5개 (ajax)
//	@GetMapping("/suggest")
//	//@ResponseBody
//	public List<CompanyDto> suggest(@RequestParam("keyword") String keyword) {
//	    return service.getSuggest(keyword);
//	}
//	
//	// 회사 수정 폼
//	@GetMapping("/edit")
//	//@PreAuthorize("hasRole('ADMIN') or hasAuthority('ROOT')")
//	public String editForm(int comId, Model model) {
//		model.addAttribute("com", service.selectOneById(comId));
//		return "/com/edit";
//	}
//	
//	// 회사 수정 기능
//	@PostMapping("/edit")
//	//@PreAuthorize("hasRole('ADMIN') or hasAuthority('ROOT')")
//	public String edit(CompanyDto dto, 
//			@RequestParam(value="logoFile", required=false) MultipartFile logoFile,
//			Authentication auth,
//			RedirectAttributes rttr) {
//		String msg = "회사 정보 수정에 실패 하였습니다.";
//		// 새 파일을 안 올렸을 때 기존 로고 URL을 유지하기 위해 수정 전 데이터를 먼저 조회
//		try {
//			CompanyDto before = service.selectOneById(dto.getComId());
//			String oldLogoUrl = (before != null) ? before.getComLogo() : null;
//
//			if (logoFile != null && !logoFile.isEmpty()) {
//				FileUploadDto result = FileUploadUtil.upload(logoFile, FileUploadType.COMPANY_LOGO);
//				dto.setComLogo(result.getFileUrl());
//			} else {
//				dto.setComLogo(oldLogoUrl);
//			}
//			if(service.update(dto) > 0) { 
//				msg = "회사 정보 수정에 성공하셨습니다.";
//				// 로고를 교체한 경우에만 기존 파일 정리
//				if (logoFile != null && !logoFile.isEmpty()) {
//					FileUploadUtil.delete(oldLogoUrl);
//				}
//			}
//		} catch (FileUploadException e) {
//			msg = e.getMessage();
//		}
//		
//		rttr.addFlashAttribute("msg", msg);
//		
//		// 권한 문자열만 추출해서 비교
//		CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
//	    Set<String> authNames = user.getAuthorities().stream()
//	            .map(GrantedAuthority::getAuthority)
//	            .collect(Collectors.toSet());
//
//	    boolean isRoot = authNames.contains("ROOT");
//	    
//	    if(isRoot) {
//	    	return "redirect:/com/list";
//	    } else {
//	    	return "redirect:/com/my";
//	    }
//		
//	}
//	
//	// 회사 삭제 폼
//	@GetMapping("/delete")
//	//@PreAuthorize("hasAuthority('ROOT')")
//	public String deleteModal(@RequestParam("comId") Integer comId, Model model) {
//	    CompanyDto dto = service.selectOneById(comId);
//	    model.addAttribute("com", dto);
//		return "/com/delModal";
//	}
//	
//	// 회사 삭제 기능
//	@PostMapping("/delete")
//	//@PreAuthorize("hasAuthority('ROOT')")
//	@ResponseBody
//	public Map<String, Object> delete(Authentication auth, EmpDto dto) {
//	    Map<String, Object> result = new HashMap<>();
//
//	    //2. 관리자가 입력한 비밀번호가 일치 하지 않을 경우
//	    CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
//	    dto.setEmpId(user.getUser().getEmpId());
//	    boolean matched = empService.matchPassword(dto);
//	    if (!matched) {
//	        result.put("success", false);
//	        result.put("message", "비밀번호가 올바르지 않습니다.");
//	        return result;
//	    }
//
//	    try {
//	        service.delete(dto.getComId());
//	        result.put("success", true);
//	    } catch (IllegalArgumentException e) {
//	        // 하위 부서 존재 등 비즈니스 로직 검증 실패
//	        result.put("success", false);
//	        result.put("message", e.getMessage());
//	    }
//	    
//	    return result;
//	}
//	
//	// 회사 정보 상세 조회
//	@GetMapping("/detail")
//	public String myDetail(@RequestParam("comId") int comId,
//						   Model model) {
//		//통계 데이터
//		StatsDeptDto stats = deptService.selecStats(comId);
//		List<DeptDto> deptList = deptService.selectOrgTree(comId);
//		CompanyDto com = service.selectOneById(comId);
//		
//		model.addAttribute("stats", stats);
//		model.addAttribute("com", com);
//		model.addAttribute("deptList", deptList);
//		return "/com/detail";
//	}
//	
//	// 내 회사 정보 조회
//	@GetMapping("/my")
//	public String mycom(Principal prinipal, HttpSession session, Model model) {
//		Integer empId = (Integer) session.getAttribute("empId");
//		Integer comId = (Integer) session.getAttribute("comId");
//		if(empId == null || comId == null) return "redirect:/auth/login";
//		
//		CompanyDto com = service.selectOneByEmpId(empId);
//		//통계 데이터
//		StatsDeptDto stats = deptService.selecStats(comId);
//		List<DeptDto> deptList = deptService.selectOrgTree(comId);
//				
//		model.addAttribute("stats", stats);
//		model.addAttribute("com", com);
//		model.addAttribute("deptList", deptList);
//		return "/com/mypage";
//	}
}