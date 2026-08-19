package com.sb.erp.notice.controller;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sb.erp.global.oauth2.CustomUserPrincipal;
import com.sb.erp.notice.dto.request.NoticeRequest;
import com.sb.erp.notice.dto.request.NoticeSearchRequest;
import com.sb.erp.notice.dto.response.NoticeResponse;
import com.sb.erp.notice.service.NoticeService;
import com.sb.erp.util.dto.PagingUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name="Notice Api", description = "Notice 관련 Api")
@RestController
@RequestMapping("/api/notice")
@RequiredArgsConstructor
public class NoticeController {
    
	private final NoticeService noticeService;  
    
    // 공지 목록 조회
    // ★Authentication
    @Operation(summary = "공지 목록 조회",description = "긴급 공지+검색 조건에 맞는 공지 목록 조회")
    @GetMapping
    public ResponseEntity<Map<String,Object>>getNotices(
    		@ModelAttribute NoticeSearchRequest search,
    		@AuthenticationPrincipal CustomUserPrincipal principal) {
    	
      	boolean isRoot = principal.getRoles().contains("ROOT");
    	if (!isRoot) { search.setComId(principal.getComId()); }
    	
    	int currentPage = search.getPstartno(); // 오염되기 전, 진짜 페이지 번호 미리 저장
    	List<NoticeResponse> notices = noticeService.getNoticeListWithUrgent(search); // 긴급5 + 일반목록
        int totalCnt = noticeService.selectCount(search);              // 전체 건수 (뱃지용)
        long pagingCnt = noticeService.selectCountNoticeList(search);  // 페이징 계산용 (pinnedBnos 반영됨)
        PagingUtil paging = new PagingUtil((int) pagingCnt, currentPage);

        Map<String, Object> result = new HashMap<>();
        result.put("paging", paging);
        result.put("notices", notices);
        result.put("totalCnt", totalCnt);
        return ResponseEntity.ok(result);
    }
    
    // 공지 등록
    // 첨부파일은 선택사항이므로 required=false (안 붙이면 파일 없는 공지 등록 시 400 에러가 났음)
    @Operation(summary = "공지 등록",description = "신규 공지 등록")
    @PostMapping(consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String,Object>> createNotice(
    		 @Parameter(description = "공지 등록 정보") @Valid @ParameterObject @ModelAttribute NoticeRequest dto,
    	     @Parameter(description = "첨부파일") @RequestParam(value = "file", required = false) MultipartFile file,
    	     @AuthenticationPrincipal CustomUserPrincipal principal){
    	Map<String, Object> result = new HashMap<>();
    	
    	dto.setComId(principal.getComId());
    	dto.setEmpId(principal.getEmpId());
    	
        try {
            noticeService.insert(dto, file);
            result.put("success", true);
            result.put("message", "공지 등록 성공");
            result.put("bno", dto.getBno());
            result.put("notice", noticeService.select(dto.getBno()));
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "공지 등록 실패");
            return ResponseEntity.badRequest().body(result);
        }

    }
    
    // 공지 수정 
    @Operation(summary = "공지 수정",description = "공지 수정")
    @PutMapping(value = "/{bno}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateNotice(
            @ModelAttribute NoticeRequest dto,
            @PathVariable("bno") Long bno,
            @RequestPart(name = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
    	
    	NoticeResponse original = noticeService.select(bno);
    	if (original == null) {
    		return ResponseEntity.notFound().build();
    	}

    	boolean isRoot = principal.getRoles().contains("ROOT");
    	if (!isRoot && !original.getComId().equals(principal.getComId())) {
    		return ResponseEntity.status(HttpStatus.FORBIDDEN)
    				.body(Map.of("message", "접근 권한이 없습니다."));
    	}

    	boolean isAdmin = isRoot || principal.getRoles().contains("ROLE_ADMIN");
    	boolean isCreator = original.getEmpId().equals(principal.getEmpId());
    	if (!isAdmin && !isCreator) {
    		return ResponseEntity.status(HttpStatus.FORBIDDEN)
    				.body(Map.of("message", "작성자 또는 관리자만 수정할 수 있습니다."));
    	}
   
    	dto.setBno(bno);
		Map<String, Object> result = new HashMap<>();
		
		try {
			noticeService.update(dto, file);
			result.put("success", true);
			result.put("message", "공지 수정 성공");
			result.put("notice", noticeService.select(bno));
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(result);
		}
    }

    //공지 삭제
    @Operation(summary = "공지 삭제", description = "공지를 삭제합니다.")
	@DeleteMapping("/{bno}")
    public ResponseEntity<Map<String, Object>> deleteNotice(
    		@PathVariable("bno") Long bno,
    		@AuthenticationPrincipal CustomUserPrincipal principal) {
    	NoticeResponse original = noticeService.select(bno);
    	if (original == null) {
    		return ResponseEntity.notFound().build();
    	}

    	boolean isRoot = principal.getRoles().contains("ROOT");
    	if (!isRoot && !original.getComId().equals(principal.getComId())) {
    		return ResponseEntity.status(HttpStatus.FORBIDDEN)
    				.body(Map.of("message", "접근 권한이 없습니다."));
    	}

    	boolean isAdmin = isRoot || principal.getRoles().contains("ROLE_ADMIN");
    	boolean isCreator = original.getEmpId().equals(principal.getEmpId());
    	if (!isAdmin && !isCreator) {
    		Map<String, Object> result = new HashMap<>();
    		result.put("success", false);
    		result.put("message", "작성자 또는 관리자만 삭제할 수 있습니다.");
    		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
    	}

		noticeService.delete(bno);
		Map<String, Object> result = new HashMap<>();
		result.put("success", true);
		result.put("message", "공지 삭제 성공");
		return ResponseEntity.ok(result);
    }

    //공지 상세 조회
	@Operation(summary = "공지 상세조회", description = "공지 상세 정보를 조회합니다. (조회수 1 증가)")
	@GetMapping("/{bno}")
	public ResponseEntity<NoticeResponse> getNotice(
	        @PathVariable("bno") Long bno,
	        @AuthenticationPrincipal CustomUserPrincipal principal) {

	    NoticeResponse dto = noticeService.select(bno);

	    if (dto == null) {
	        return ResponseEntity.notFound().build();
	    }

	    boolean isRoot = principal.getRoles().contains("ROOT");

	    if (!isRoot && !dto.getComId().equals(principal.getComId())) {
	        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
	    }

	    noticeService.updateHit(bno);

	    dto = noticeService.select(bno);

	    return ResponseEntity.ok(dto);
	}

    // 검색 결과 카운트 (GET 방식) //어디서 쓰이는지 잘 모르겠음
	@Operation(summary = "공지 검색 결과 카운트", description = "검색 조건에 맞는 공지 건수만 조회합니다.")
	@GetMapping("/search-count")
	public ResponseEntity<Integer> getSearchCount(NoticeSearchRequest search) {
		return ResponseEntity.ok(noticeService.selectCountNoticeList(search));
	}
	
	@GetMapping("/{bno}/file")
	public ResponseEntity<byte[]> downloadFile(
	        @PathVariable("bno") Long bno,
	        @AuthenticationPrincipal CustomUserPrincipal principal) throws Exception {

	    NoticeResponse notice = noticeService.select(bno);
	    if (notice == null || notice.getBfile() == null || notice.getBfile().isBlank()) {
	        return ResponseEntity.notFound().build();
	    }
	    boolean isRoot = principal.getRoles().contains("ROOT");
	    if (!isRoot && !notice.getComId().equals(principal.getComId())) {
	        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
	    }
	    String[] parts = notice.getBfile().split("\\|", 3);
	    // 기존 형식의 첨부파일인 경우
	    if (parts.length < 3) { return ResponseEntity.notFound().build(); }
	    String fileName = parts[0];
	    String contentType = parts[1];
	    byte[] data;
	    try {
	        data = Base64.getDecoder().decode(parts[2]);
	    } catch (IllegalArgumentException e) {
	        // 기존 데이터가 현재 Base64 형식이 아닌 경우
	        return ResponseEntity.notFound().build();
	    }
	    String encodedName = java.net.URLEncoder.encode(fileName, "UTF-8");
	    return ResponseEntity.ok()
	            .contentType(MediaType.parseMediaType(contentType))
	            .header(
	                "Content-Disposition",
	                "attachment; filename*=UTF-8''" + encodedName
	            )
	            .body(data);
	}
}
/*//공지 목록 조회
    @GetMapping("/list")
    public String list(NoticeSearchRequest search,
    		Authentication auth, Model model) {
    	CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
    	search.setComId(user.getUser().getComId());
    	
    	int currentPage = search.getPstartno(); // 오염되기 전, 진짜 페이지 번호 미리 저장
    	
    	List<NoticeRequest> notices = noticeService.getNoticeListWithUrgent(search); // 긴급5 + 일반목록

        int totalCnt = noticeService.selectCount(search);              // 전체 건수 (뱃지용)
        long pagingCnt = noticeService.selectCountNoticeList(search);  // 페이징 계산용 (pinnedBnos 반영됨)
        
        PagingUtil paging = new PagingUtil((int) pagingCnt, currentPage);

		model.addAttribute("search", search);
        model.addAttribute("paging", paging);
        model.addAttribute("notices", notices);
        model.addAttribute("totalCnt", totalCnt);
        return "notice/list"; 
    }
    
    //공지 등록 뷰
    @GetMapping("/write")
    public String insertNoticeView() { return "notice/write"; } 
    
    //공지 등록 처리
    // 첨부파일은 선택사항이므로 required=false (안 붙이면 파일 없는 공지 등록 시 400 에러가 났음)
    @PostMapping("/write")
    public String insertNotice(NoticeRequest dto,
			@RequestParam(value = "file", required = false) MultipartFile file, HttpSession session, RedirectAttributes rttr) {
    	Integer empId = (Integer) session.getAttribute("empId");
    	Integer comId = (Integer) session.getAttribute("comId");
    	
    	dto.setEmpId(empId); //### 보안 로그 인식 emp_id 셋팅- 로그인 후 세션 가져오기
    	dto.setComId(comId); //### 보안 로그 인식 comId 셋팅-
 
        try {
            noticeService.insert(dto, file);
        } catch (Exception e) {
        	rttr.addFlashAttribute("result", e.getMessage());
            return "redirect:/notice/write";
        }
    	
        return "redirect:/notice/list"; 
    }
    
    //공지 수정 뷰
    @GetMapping("/edit")
    public String edit(@RequestParam("bno") int bno, Model model) {
        NoticeRequest dto = noticeService.select(bno);
        model.addAttribute("dto", dto);
        return "notice/edit"; 
    }
    
    //공지 수정 처리
    @PostMapping("/edit")
    public String update(NoticeRequest dto,
			@RequestParam(value = "file", required = false) MultipartFile file, HttpSession session, RedirectAttributes rttr) {
    	Integer empId = (Integer) session.getAttribute("empId");
    	Integer comId = (Integer) session.getAttribute("comId");
    	
    	dto.setEmpId(empId); //### 보안 로그 인식 emp_id 셋팅- 로그인 후 세션 가져오기
    	dto.setComId(comId); //### 보안 로그 인식 emp_id 셋팅-
        try {
            noticeService.update(dto, file);
        } catch (Exception e) {
        	rttr.addFlashAttribute("result", e.getMessage());
            return "redirect:/notice/edit?bno=" + dto.getBno();
        }
        return "redirect:/notice/detail?bno=" + dto.getBno(); // 수정 완료 후 상세 페이지로 이동
    }

    //공지 삭제
    @GetMapping("/delete")
    public String delete(@RequestParam("bno") int bno) {
        noticeService.delete(bno);  // DB 삭제 수행
        return "redirect:/notice/list"; // 삭제 완료 후 리스트 페이지로 리다이렉트
    }

    //공지 상세 조회
    @GetMapping("/detail")
    public String select(@RequestParam("bno") int bno, Model model) {
        noticeService.updateHit(bno); // 게시글 상세 진입 시 조회수 1 증가 처리 
        NoticeRequest dto = noticeService.select(bno);
        model.addAttribute("notice", dto); // JSP에서 ${notice}로 접근 가능
        return "notice/detail"; // notice/detail.jsp 뷰 반환
    }

    // 검색 결과 카운트 (GET 방식) //어디서 쓰이는지 잘 모르겠음
    @GetMapping("/searchCount")
    public String selectCountNoticeList(NoticeSearchRequest search, Model model) {
        long searchCount = noticeService.selectCountNoticeList(search);
        model.addAttribute("searchCount", searchCount); // 결과 카운트 정수 바인딩
        return "notice/searchCount"; // 카운트를 노출할 전용 뷰 혹은 페이지 반환
    }*/