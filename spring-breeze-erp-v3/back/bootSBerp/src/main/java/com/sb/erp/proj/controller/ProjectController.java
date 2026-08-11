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
import com.sb.erp.emp.service.EmpService;
import com.sb.erp.proj.dto.request.ProjRequest;
import com.sb.erp.proj.dto.request.ProjectSearchRequest;
import com.sb.erp.proj.dto.response.ProjResponse;
import com.sb.erp.proj.service.ProjectMemberService;
import com.sb.erp.proj.service.ProjectService;
import com.sb.erp.task.dto.request.TaskSearchRequest;
import com.sb.erp.task.service.TaskService;
import com.sb.erp.util.dto.PagingUtil;

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
	private final EmpService empService;
	
	
	// 프로젝트 목록
	// ★Authentication 
	@Operation(summary = "프로젝트 목록 조회",description = "검색 조건에 맞는 프로젝트 목록 조회")
	@GetMapping
	public ResponseEntity<Map<String, Object>> getProjects(@ModelAttribute ProjectSearchRequest search) {
		
		int totalCnt = service.selectCnt(search);              // 전체 데이터 수
		PagingUtil paging = new PagingUtil(totalCnt, search.getPstartno());
		List<ProjResponse> list = service.selectAll(search);    // 목록 조회

		Map<String, Object> result = new HashMap<>();
		result.put("list", list);
		result.put("paging", paging);
		return ResponseEntity.ok(result);
	}	
	
	// 사원 검색
	// ★Authentication
	@Operation(summary = "사원 검색",description = "프로젝트 멤버 추가용 사원 검색")
	@GetMapping("/empSearch")//사원 조회
	public ResponseEntity<List<EmpResponse>> empSearch(@RequestParam("comId") Long comId,
            @RequestParam("keyword") String keyword){
		 
		return ResponseEntity.ok(memberService.searchEmpForProject(comId, keyword));
	}
	
	// 프로젝트 등록
	// ★Authentication 
	@Operation(summary = "프로젝트 등록", description = "신규 프로젝트 등록")
	@PostMapping
	public ResponseEntity<Map<String, Object>> createProject(@RequestBody ProjRequest dto) { //등록처리

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
	// ★Authentication 
	@Operation(summary = "프로젝트 상세조회", description = "프로젝트 상세 + 태스크 목록 + 멤버 목록 조회")
	@GetMapping("/{proId}")
	public ResponseEntity<Map<String, Object>> getProjectDetail(
			@PathVariable("proId") Long proId,
			@RequestParam(defaultValue = "1") int pstartno){
		ProjResponse dto = service.select(proId);
		if (dto == null) {
			return ResponseEntity.notFound().build();
		}

	    // 태스크 페이징 처리
	    int taskTotalCnt = taskService.selectCnt(proId);
	    PagingUtil paging = new PagingUtil(taskTotalCnt, pstartno);

	    TaskSearchRequest taskSearch = new TaskSearchRequest();
	    taskSearch.setProId(proId);
	    taskSearch.setPstartno((pstartno - 1) * taskSearch.getOnepagelist());
	    
	    Map<String, Object> result = new HashMap<>();
	    result.put("dto",dto);
	    result.put("list", taskService.selectAll(taskSearch));
	    result.put("paging", paging);
	    result.put("memberList", memberService.select(proId));

	    return ResponseEntity.ok(result);
	}
	
	// 프로젝트 수정
	// ★Authentication 
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
	// ★Authentication
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
	// ★Authentication
	@Operation(summary = "AI 프로젝트 분석", description = "프로젝트 리스크 분석 결과를 반환")
	@GetMapping("/{proId}/analysis")
	public ResponseEntity<String> analyzeProject(@PathVariable("proId") Long proId) {
		
	    return ResponseEntity.ok(service.analyzeProject(proId));
	}

}
/*	@InitBinder
	public void initBinder(WebDataBinder binder) {//문자열 ->localdate로 변환
		binder.registerCustomEditor(LocalDate.class, new PropertyEditorSupport() {
			@Override public void setAsText(String text) {
				if (text == null || text.isBlank()) { setValue(null);
				} else { setValue(LocalDate.parse(text)); }
			}
		});
	}
	
	// 프로젝트 목록 페이지
	@GetMapping("/proj_list") // 전체출력시
	public String listselect(ProjectSearchRequest search, Model model ,Authentication auth) {
		
		// 현재 로그인 사용자
	    CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
	    int comId = user.getUser().getComId();
		//권한 체크
	    boolean isRoot = auth.getAuthorities().stream()
	            .anyMatch(a -> "ROOT".equals(a.getAuthority()));

	    if (!isRoot) {
	        search.setComId(comId);
	    } else {
	        search.setComId(null);
	    }
		    model.addAttribute("search", search);
		if(!search.isSearched()) {return "proj/proj_list";}

		int totalCnt = service.selectCnt(search); //전체 데이터 수

	    PagingUtil paging = new PagingUtil(totalCnt, search.getPstartno());
	    
	    List<ProjRequest> list = service.selectAll(search); //목록 조회

		model.addAttribute("paging", paging);
		model.addAttribute("list", list);
		return "proj/proj_list";
	}	
	
	@ResponseBody
	@GetMapping("/empSearch")//사원 조회
	public List<EmpDto> empSearch(@RequestParam String keyword,Authentication auth) {
		 CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();//해당 회사의 해당 사원을 조회할것
	  
	    return memberService.searchEmpForProject(user.getUser().getComId(), keyword);
	}
	
	@GetMapping("/proj_create")
	public String insert() {return "proj/proj_create";} //등록
	
	@PostMapping("/proj_create")
	public String insert_post(ProjRequest dto, RedirectAttributes rttr, Authentication auth) { //등록처리
		
		CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
		
		dto.setComId(user.getUser().getComId());
		dto.setEmpId(user.getUser().getEmpId());
		 
		String result="프로젝트 등록 실패";
	   if(service.insert(dto)>0) {result="프로젝트 등록 성공";}
	   rttr.addFlashAttribute("result",result);
	  return "redirect:/proj/proj_list";
	}
	
	@GetMapping("/proj_detail")
	public String select(@RequestParam("pro_id") int proId,
	                      @RequestParam(defaultValue = "1") int pstartno,
	                      Model model, Authentication auth) {
		ProjRequest dto = service.select(proId);
		SecurityUtil.checkComIdAccess(dto.getComId());
		
		CustomUserDetails user = (CustomUserDetails)auth.getPrincipal();
		


		boolean isAdmin = SecurityUtil.isAdminOrRoot(auth);
		boolean isCreator = dto.getEmpId() == user.getUser().getEmpId();

		boolean isMember = memberService.select(proId).stream()
		        .anyMatch(m -> m.getEmpId() == user.getUser().getEmpId());

		if (!isAdmin && !isCreator && !isMember) {
		    throw new AccessDeniedException("접근 권한이 없습니다.");
		}
	    // 태스크 페이징 처리
	    int taskTotalCnt = taskService.selectCnt(proId);
	    PagingUtil paging = new PagingUtil(taskTotalCnt, pstartno);

	    TaskSearchRequest taskSearch = new TaskSearchRequest();
	    taskSearch.setProId(proId);
	    taskSearch.setPstartno((pstartno - 1) * taskSearch.getOnepagelist());
	    
	    model.addAttribute("dto",dto);
	    model.addAttribute("list", taskService.selectAll(taskSearch));
	    model.addAttribute("paging", paging);
	    model.addAttribute("memberList", memberService.select(proId));
	    model.addAttribute("loginEmpId", user.getUser().getEmpId());
	    model.addAttribute("isAdmin", isAdmin);

	    return "proj/proj_detail";
	}
	
	@GetMapping("/proj_edit")
	public String editView(@RequestParam("pro_id") int proId, Model model, Authentication auth) { //수정뷰
		
	    ProjRequest dto = service.select(proId);
	    SecurityUtil.checkComIdAccess(dto.getComId());
	    boolean isAdmin = SecurityUtil.isAdminOrRoot(auth);
	    boolean isCreator = dto.getEmpId() == SecurityUtil.getCurrentEmpId();

	    if (!isAdmin && !isCreator) {
	        throw new AccessDeniedException("접근 권한이 없습니다.");
	    }
		model.addAttribute("dto", service.editView(proId));
		return "proj/proj_edit";
	}
	
	@PostMapping("/proj_edit")
	public String edit_post(ProjRequest dto,RedirectAttributes rttr, Authentication auth) { //수정처리

		CustomUserDetails user = (CustomUserDetails)auth.getPrincipal();
		ProjRequest origin = service.select(dto.getProId());
		SecurityUtil.checkComIdAccess(dto.getComId());
		 boolean isAdmin = SecurityUtil.isAdminOrRoot(auth);

		if (!isAdmin && origin.getEmpId() != user.getUser().getEmpId()) {
			rttr.addFlashAttribute("result", "프로젝트 생성자 또는 관리자만 수정할 수 있습니다.");
			return "redirect:/proj/proj_detail?pro_id=" + dto.getProId();
		} 
		
		String result="프로젝트 수정 실패";
		if(service.edit(dto)>0) {result="프로젝트 수정 성공";}
		rttr.addFlashAttribute("result",result);
		return "redirect:/proj/proj_detail?pro_id="+dto.getProId();
	}
	
	@GetMapping("/delete") //삭제
	public String delete(@RequestParam("pro_id") int proId, RedirectAttributes rttr, Authentication auth) {
		CustomUserDetails user = (CustomUserDetails)auth.getPrincipal();
		ProjRequest dto = service.select(proId);
		SecurityUtil.checkComIdAccess(dto.getComId());
		int empId = user.getUser().getEmpId();
		
		boolean isAdmin = SecurityUtil.isAdminOrRoot(auth);
		if (!isAdmin && dto.getEmpId() != empId) {
			rttr.addFlashAttribute("result", "프로젝트 생성자 또는 관리자만 삭제할 수 있습니다.");//권한,프로젝트 생성자만 삭제가능
			return "redirect:/proj/proj_detail?pro_id=" +proId;
		}
		
		String result="프로젝트 삭제 실패";
		
		if(service.delete(proId)>0) {result="프로젝트 삭제 성공";}
		rttr.addFlashAttribute("result",result);
		return "redirect:/proj/proj_list";
	}
	
	@GetMapping("/analysis") //API(1)-ai분석결과
	@ResponseBody
	public ResponseEntity<String> analyzeProject(@RequestParam Integer proId, Authentication auth) {
		CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
		int empId = user.getUser().getEmpId();
	    ProjRequest project = service.select(proId);
	    SecurityUtil.checkComIdAccess(project.getComId());
	    boolean isAdmin = SecurityUtil.isAdminOrRoot(auth);
	    boolean isCreator = project.getEmpId() == empId;

	    boolean isMember = memberService.select(proId).stream()
	            .anyMatch(m -> m.getEmpId() == SecurityUtil.getCurrentEmpId());

	    if (!isAdmin && !isCreator && !isMember) {
	        return ResponseEntity.status(HttpStatus.FORBIDDEN)
	                .body("접근 권한이 없습니다.");
	    }
		
		return  ResponseEntity.ok(service.analyzeProject(proId));
	}*/
