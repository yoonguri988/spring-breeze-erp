package com.sb.erp.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.sb.erp.dto.NoticeDto;
import com.sb.erp.dto.NoticeSearchDto;
import com.sb.erp.service.NoticeService;
import com.sb.erp.util.PagingUtil;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/notice")
public class NoticeController {
    
    @Autowired NoticeService noticeService;  
    
    //공지 목록 조회
    @GetMapping("/list")
    public String list(NoticeSearchDto search, Model model) {
		
		/*
		 * int totalCnt = 0; PagingUtil paging = null;
		 * 
		 * List<NoticeDto> notices = Collections.emptyList();
		 * 
		 * boolean isEmpty = !search.hasSearchCondition(); if(!isEmpty) { totalCnt =
		 * noticeService.selectCount(); paging = new PagingUtil( totalCnt ,
		 * search.getPstartno()); notices = noticeService.selectAll(search); }
		 */
        int totalCnt = noticeService.selectCount();
        PagingUtil paging = new PagingUtil(totalCnt, search.getPstartno());
        List<NoticeDto> notices = noticeService.selectAll(search);
		
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
    @PostMapping("/write")
    public String insertNotice(NoticeDto dto, 
			@RequestParam("file")  MultipartFile file, HttpSession session) {
    	Integer empId = (Integer) session.getAttribute("empId");
    	Integer comId = (Integer) session.getAttribute("comId");
    	
    	dto.setEmpId(empId); //### 보안 로그 인식 emp_id 셋팅- 로그인 후 세션 가져오기
    	dto.setComId(comId); //### 보안 로그 인식 comId 셋팅-
 
        noticeService.insert(dto, file);
        return "redirect:/notice/list"; 
    }
    
    //공지 수정 뷰
    @GetMapping("/edit")
    public String edit(@RequestParam("bno") int bno, Model model) {
        NoticeDto dto = noticeService.select(bno);
        model.addAttribute("dto", dto);
        return "notice/edit"; 
    }
    
    //공지 수정 처리
    @PostMapping("/edit")
    public String update(NoticeDto dto, 
			@RequestParam("file")  MultipartFile file, HttpSession session) {
    	Integer empId = (Integer) session.getAttribute("empId");
    	Integer comId = (Integer) session.getAttribute("comId");
    	
    	dto.setEmpId(empId); //### 보안 로그 인식 emp_id 셋팅- 로그인 후 세션 가져오기
    	dto.setComId(comId); //### 보안 로그 인식 emp_id 셋팅-
        noticeService.update(dto, file); // DB 수정 업데이트 수행
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
        NoticeDto dto = noticeService.select(bno);
        model.addAttribute("notice", dto); // JSP에서 ${notice}로 접근 가능
        return "notice/detail"; // notice/detail.jsp 뷰 반환
    }

    // 검색 결과 카운트 (GET 방식) //어디서 쓰이는지 잘 모르겠음
    @GetMapping("/searchCount")
    public String selectCountNoticeList(NoticeSearchDto search, Model model) {
        long searchCount = noticeService.selectCountNoticeList(search);
        model.addAttribute("searchCount", searchCount); // 결과 카운트 정수 바인딩
        return "notice/searchCount"; // 카운트를 노출할 전용 뷰 혹은 페이지 반환
    }
}