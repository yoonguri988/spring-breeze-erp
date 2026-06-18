package com.sb.erp.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.sb.erp.dto.NoticeDto;
import com.sb.erp.service.NoticeService;

/* Controller 계층
 * JSP와 연결되는 MVC 방식
 * Controller는 JSP 뷰 이름을 반환 (notice/list, notice/detail 등)
 */

@Controller
public class NoticeController {
	@Autowired   NoticeService noticeService;
	
	@RequestMapping(value="/notice/list", method= RequestMethod.GET)
	   public String list(Model model) {
	     
	      return "/notice/list";
	   }

    // 공지 등록
    @PostMapping("/insert")
    public int insert(@RequestBody NoticeDto dto) {
        return noticeService.insert(dto);
    }

    // 공지 수정
    @PutMapping("/update")
    public int update(@RequestBody NoticeDto dto) {
        return noticeService.update(dto);
    }

    // 공지 삭제
    @DeleteMapping("/delete/{bno}")
    public int delete(@PathVariable int bno) {
        return noticeService.delete(bno);
    }

    // 공지 상세 조회
    @GetMapping("/detail/{bno}")
    public NoticeDto select(@PathVariable int bno) {
        noticeService.updateHit(bno); // 조회수 증가
        return noticeService.select(bno);
    }

    // 페이징 조회
//    @GetMapping("/list")
//    public List<NoticeDto> selectPaging(@RequestParam int offset, @RequestParam int pageSize) {
//        HashMap<String, Object> map = new HashMap<>();
//        map.put("offset", offset);
//        map.put("pageSize", pageSize);
//        return noticeService.selectPaging(map);
//    }

    // 검색 + 페이징
    @GetMapping("/search")
    public List<NoticeDto> selectNoticeList(@RequestParam String searchKeyword,
                                            @RequestParam int offset,
                                            @RequestParam int pageSize) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("searchKeyword", searchKeyword);
        map.put("offset", offset);
        map.put("pageSize", pageSize);
        return noticeService.selectNoticeList(map);
    }

    // 전체 카운트
    @GetMapping("/count")
    public int selectCount() {
        return noticeService.selectCount();
    }

    // 검색 결과 카운트
    @GetMapping("/searchCount")
    public long selectCountNoticeList(@RequestParam String searchKeyword) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("searchKeyword", searchKeyword);
        return noticeService.selectCountNoticeList(map);
    }
}


