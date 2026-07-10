package com.sb.erp.controller;

import java.beans.PropertyEditorSupport;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
import com.sb.erp.service.EmpService;
import com.sb.erp.service.ProjectMemberService;
import com.sb.erp.service.ProjectService;
import com.sb.erp.service.TaskService;
import com.sb.erp.util.PagingUtil;

import jakarta.servlet.http.HttpSession;


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
	public String listselect(ProjectSearchDto search, Model model, HttpSession session
			                 ,Authentication authentication) {
		
		//권한 체크
		boolean isAdmin = authentication.getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROOT") || a.getAuthority().equals("ROLE_ADMIN"));
		   if (!isAdmin) {
		        // 일반 사원 → 자기 회사만
		        Integer comId = (Integer) session.getAttribute("comId");
		        search.setComId(comId);
		    } else {
		        // 관리자 → 전체 회사
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
	public List<EmpDto> empSearch(@RequestParam String keyword, HttpSession session) {
	    Integer comId = (Integer) session.getAttribute("comId");//해당 회사의 해당 사원을 조회할것
	  
	    return memberService.searchEmpForProject(comId, keyword);
	}
	
	
	@GetMapping("/proj_create")
	public String insert() {return "proj/proj_create";} //등록
	
	
	@PostMapping("/proj_create")
	public String insert_post(ProjectDto dto, HttpSession session,
			RedirectAttributes rttr) { //등록처리
		
		Integer empId = (Integer) session.getAttribute("empId"); //로그인한 사원의 정보를 가져옴
		Integer comId = (Integer) session.getAttribute("comId");
		
		 if (empId == null || comId == null) { return "redirect:/auth/login"; }//로그인 사용자가 아니라면 로그인화면으로
		 	
		dto.setComId(comId);
		dto.setEmpId(empId);
		 
		String result="프로젝트 등록 실패";
	   if(service.insert(dto)>0) {result="프로젝트 등록 성공";}
	   rttr.addFlashAttribute("result",result);
	  return "redirect:/proj/proj_list";
	}
	
	@GetMapping("/proj_detail")
	public String select(@RequestParam("pro_id") int proId,
	                      @RequestParam(defaultValue = "1") int pstartno,
	                      Model model, Authentication authentication) {
	    
	    model.addAttribute("dto", service.select(proId));
	    
		EmpDto loginEmp = empService.selectByEmpEmail(authentication.getName()); //삭제버튼이 보일 유저들
		boolean isAdmin = authentication.getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROOT") || a.getAuthority().equals("ROLE_ADMIN")); 

	    // 태스크 페이징 처리
	    int taskTotalCnt = taskService.selectCnt(proId);
	    PagingUtil paging = new PagingUtil(taskTotalCnt, pstartno);

	    TaskSearchDto taskSearch = new TaskSearchDto();
	    taskSearch.setProId(proId);
	    taskSearch.setPstartno((pstartno - 1) * taskSearch.getOnepagelist());

	    model.addAttribute("list", taskService.selectAll(taskSearch));
	    model.addAttribute("paging", paging);
	    model.addAttribute("memberList", memberService.select(proId));
	    model.addAttribute("loginEmpId", loginEmp.getEmpId());
	    model.addAttribute("isAdmin", isAdmin);

	    return "proj/proj_detail";
	}
	
	@GetMapping("/proj_edit")
	public String editView(@RequestParam("pro_id") int proId, Model model) { //수정뷰
		model.addAttribute("dto", service.editView(proId));
		return "proj/proj_edit";
	}
	
	@PostMapping("/proj_edit")
	public String edit_post(ProjectDto dto,RedirectAttributes rttr, Authentication authentication) { //수정처리
		ProjectDto origin = service.select(dto.getProId());
		
		 EmpDto loginEmp = empService.selectByEmpEmail(authentication.getName());

		boolean isAdmin = authentication.getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROOT") || a.getAuthority().equals("ROLE_ADMIN"));

		if (!isAdmin && origin.getEmpId() != loginEmp.getEmpId()) {
			rttr.addFlashAttribute("result", "프로젝트 생성자 또는 관리자만 수정할 수 있습니다.");
			return "redirect:/proj/proj_detail?pro_id=" + dto.getProId();
		} 
		
		String result="프로젝트 수정 실패";
		if(service.edit(dto)>0) {result="프로젝트 수정 성공";}
		rttr.addFlashAttribute("result",result);
		return "redirect:/proj/proj_detail?pro_id="+dto.getProId();
	}
	
	@GetMapping("/delete") //삭제
	public String delete(@RequestParam("pro_id") int proId, RedirectAttributes rttr, Authentication authentication) {
		ProjectDto dto = service.select(proId);
		
		EmpDto loginEmp = empService.selectByEmpEmail(authentication.getName());
		boolean isAdmin = authentication.getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROOT") || a.getAuthority().equals("ROLE_ADMIN"));
		if (!isAdmin && dto.getEmpId() != loginEmp.getEmpId()) {
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
	public String analyzeProject(@RequestParam Integer proId) {
		return service.analyzeProject(proId);
	}

}
