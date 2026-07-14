package com.sb.erp.controller;

import java.beans.PropertyEditorSupport;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.ProjectDto;
import com.sb.erp.dto.ProjectSearchDto;
import com.sb.erp.dto.TaskSearchDto;
import com.sb.erp.security.CustomUserDetails;
import com.sb.erp.service.EmpService;
import com.sb.erp.service.ProjectMemberService;
import com.sb.erp.service.ProjectService;
import com.sb.erp.service.TaskService;
import com.sb.erp.util.PagingUtil;
import com.sb.erp.util.SecurityUtil;

@Controller
@RequestMapping("/proj")
public class ProjectController {
	@Autowired ProjectService service;
	@Autowired TaskService taskService;
	@Autowired ProjectMemberService memberService;
	@Autowired EmpService empService;
	
	@InitBinder
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
	public String listselect(ProjectSearchDto search, Model model ,Authentication auth) {
		
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
	    
	    List<ProjectDto> list = service.selectAll(search); //목록 조회

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
	public String insert_post(ProjectDto dto, RedirectAttributes rttr, Authentication auth) { //등록처리
		
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
		ProjectDto dto = service.select(proId);
		SecurityUtil.checkComIdAccess(dto.getComId());
		
		CustomUserDetails user = (CustomUserDetails)auth.getPrincipal();
		
		// 회사 소속 검증
	    if (!SecurityUtil.isAdminOrRoot(auth)
	            && dto.getComId() != user.getUser().getComId()) {
	        throw new AccessDeniedException("접근 권한이 없습니다.");
	    }

		boolean isAdmin = SecurityUtil.isAdminOrRoot(auth);

	    // 태스크 페이징 처리
	    int taskTotalCnt = taskService.selectCnt(proId);
	    PagingUtil paging = new PagingUtil(taskTotalCnt, pstartno);

	    TaskSearchDto taskSearch = new TaskSearchDto();
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
		
	    ProjectDto dto = service.select(proId);
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
	public String edit_post(ProjectDto dto,RedirectAttributes rttr, Authentication auth) { //수정처리

		CustomUserDetails user = (CustomUserDetails)auth.getPrincipal();
		ProjectDto origin = service.select(dto.getProId());
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
		ProjectDto dto = service.select(proId);
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
	    ProjectDto project = service.select(proId);
	    boolean isAdmin = SecurityUtil.isAdminOrRoot(auth);
	    boolean isCreator = project.getEmpId() == empId;

	    boolean isMember = memberService.select(proId).stream()
	            .anyMatch(m -> m.getEmpId() == SecurityUtil.getCurrentEmpId());

	    if (!isAdmin && !isCreator && !isMember) {
	        return ResponseEntity.status(HttpStatus.FORBIDDEN)
	                .body("접근 권한이 없습니다.");
	    }
		
		return  ResponseEntity.ok(service.analyzeProject(proId));
	}

}
