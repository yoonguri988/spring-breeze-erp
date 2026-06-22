package com.sb.erp.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.sb.erp.dto.NoticeDto;
import com.sb.erp.service.NoticeService;  // 본인의 서비스 인터페이스 임포트
import com.sb.erp.util.PagingUtil;

/* Controller 계층
 * JSP와 연결되는 MVC 방식의 핵심 컨트롤러 클래스
 * 모든 요청 메서드는 JSP 뷰 이름(String)을 반환하거나 리다이렉트(redirect:) 처리
 */
@Controller
public class NoticeController {
    
    @Autowired   
    NoticeService noticeService;  // 비즈니스 서비스 레이어 자동 주입
    
    // 1. 공지사항 메인 리스트 조회 페이지 이동 (GET 방식 수정 완료)
    @RequestMapping(value="/notice/list.do", method= RequestMethod.GET)
    public String list(Model model, @RequestParam(value="pstartno" , defaultValue = "1" ) int pstartno ) {
    	HashMap<String, Object> map= new HashMap<>();
		map.put("start", (pstartno-1)*10);  
		map.put("end"  ,  10);
		// 페이징 유틸리티 객체 및 페이징된 공지사항 목록을 Model에 바인딩
        model.addAttribute("paging", new PagingUtil( noticeService.selectCount() , pstartno));
        model.addAttribute("notices", noticeService.selectPaging(map));
        return "notice/list";   // notice/list.jsp 뷰 렌더링
    }

    // 2. 새 공지 등록 처리 (POST 방식)
    // - HTML Form 태그를 통해 전송된 데이터를 @ModelAttribute로 매핑하여 받습니다.
    // 새 공지사항 글 작성 처리 - JSP의 openNewModal()에서 지정한 'form.action = contextPath + "/notice/insert"'를 수신
    @PostMapping("/notice/insert.do")
    public String insertNotice(@ModelAttribute NoticeDto dto) {
    	// 등록 로직 처리 // ### 임시 세션 연동
    	dto.setEmpId(1); //### 보안 로그 인식 emp_id 셋팅- 로그인 후 구현 시 세션 객체에서 가져오도록 가공할 구역
    	dto.setComId(1); //### 보안 로그 인식 emp_id 셋팅- 
 
        noticeService.insert(dto);  // DB 저장 로직 수행
        return "redirect:/notice/list.do"; // 등록 완료 후 목록 페이지로 강제 리다이렉트 (.do 패턴)
    }
    // 3. 공지 수정 페이지 이동 (GET 방식)
    @GetMapping("/notice/edit.do")
    public String edit(@RequestParam("bno") int bno, Model model) {
        NoticeDto dto = noticeService.select(bno);
        model.addAttribute("notice", dto); // JSP에서 ${notice}로 접근 가능
        return "notice/edit"; // notice/detail.jsp 뷰 반환
    }
    
    // 4. 공지 수정 처리 (POST 방식)
    //  HTML Form은 기본적으로 PUT을 지원하지 않으므로 POST 방식으로 변경합니다.
    @PostMapping("/notice/edit.do")
    public String update(@ModelAttribute NoticeDto dto) {
    	// ### 임시 세션 연동 - 로그인 정보 매핑 처리
    	dto.setEmpId(1); //### 보안 로그 인식 emp_id 셋팅- 로그인 후 세션 가져오기
    	dto.setComId(1); //### 보안 로그 인식 emp_id 셋팅-
        noticeService.update(dto); // DB 수정 업데이트 수행
        return "redirect:/notice/detail.do?bno=" + dto.getBno(); // 수정 완료 후 상세 페이지로 이동
    }

    // 5. 공지 삭제 처리 (POST 방식)
    // - @PathVariable 대신 쿼리 스트링(?bno=1) 형태로 받아 처리합니다.
    @PostMapping("/notice/delete.do")
    public String delete(@RequestParam("bno") int bno) {
        noticeService.delete(bno);  // DB 삭제 수행
        return "redirect:/notice/list.do"; // 삭제 완료 후 리스트 페이지로 리다이렉트
    }

    // 6. 공지 상세 조회 (GET 방식)
    // - URL 경로 대신 쿼리 스트링(?bno=1)으로 글 번호를 받아 Model에 담아 JSP로 전달합니다.
    @GetMapping("/notice/detail.do")
    public String select(@RequestParam("bno") int bno, Model model) {
        noticeService.updateHit(bno); // 게시글 상세 진입 시 조회수 1 증가 처리 
        NoticeDto dto = noticeService.select(bno);
        model.addAttribute("notice", dto); // JSP에서 ${notice}로 접근 가능
        return "notice/detail"; // notice/detail.jsp 뷰 반환
    }

    // 7. 검색 + 페이징 결과 리스트 조회 (GET 방식)
    @GetMapping("/notice/search")
    public String selectNoticeList(@RequestParam String searchKeyword,
                                   @RequestParam(defaultValue = "0") int offset,
                                   @RequestParam(defaultValue = "10") int pageSize, 
                                   Model model) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("searchKeyword", searchKeyword);
        map.put("offset", offset);
        map.put("pageSize", pageSize);
        
        List<NoticeDto> list = noticeService.selectNoticeList(map);
        model.addAttribute("noticeToNoticeList", list); // 검색 결과 리스트를 모델에 저장
        
        return "notice/searchList"; // 결과를 보여줄 JSP 경로
    }

//    // 전체 카운트 (GET 방식)
//    @GetMapping("/count")
//    public String selectCount(Model model) {
//        int count = noticeService.selectCount();
//        model.addAttribute("totalCount", count);
//        return "/notice/count"; 
//    }

    // 검색 결과 카운트 (GET 방식)
    @GetMapping("/notice/searchCount")
    public String selectCountNoticeList(@RequestParam String searchKeyword, Model model) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("searchKeyword", searchKeyword);
        
        long searchCount = noticeService.selectCountNoticeList(map);
        model.addAttribute("searchCount", searchCount); // 결과 카운트 정수 바인딩
        return "notice/searchCount"; // 카운트를 노출할 전용 뷰 혹은 페이지 반환
    }
}