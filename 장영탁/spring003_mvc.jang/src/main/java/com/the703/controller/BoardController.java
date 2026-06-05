package com.the703.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.the703.dto.BoardDto;
import com.the703.service.BoardService;

@Controller
public class BoardController {
	@Autowired 
	BoardService service;
	
	// ■ 1. 전체리스트
	// 테스트:http://localhost:8282/spring003_mvc/board/list.do
	@RequestMapping("/board/list.do")
	public String list(Model model) {
		model.addAttribute("list", service.selectAll());
		return "board/list";
	}
	
	// ■ 2. 글쓰기 폼경로
	// 테스트 : http://localhost:8282/spring003_mvc/board/write.do
	@RequestMapping(value="/board/write.do", method=RequestMethod.GET)
	public String write() {
		return "board/write";
	}
	
	// ■ 2. 글쓰기 기능
	@RequestMapping(value="/board/write.do", method=RequestMethod.POST)
	public String write_post(BoardDto dto, RedirectAttributes rttr) {	
		String result = "글쓰기 실패";
		
		if(service.insert(dto) > 0 ) { 
			result = "글쓰기 성공";
		}
		rttr.addFlashAttribute("result", result);	
		return "redirect:/board/list.do";			
	}
	
	// ■ 3. 글 상세보기
	// 테스트 : http://localhost:8282/spring003_mvc/board/detail.do
	@RequestMapping("/board/detail.do")
	public String detail(@RequestParam("bno") int bno, Model model) {
		service.updateHit(bno);	
		model.addAttribute("dto", service.detail(bno));
		return "board/detail";
	}
	
	// ■ 4. 글 수정폼 경로 
	@RequestMapping(value="/board/edit.do", method=RequestMethod.GET)
	public String edit(@RequestParam("bno") int bno, Model model) {		//넘겨받는 bno, edit.jsp
		model.addAttribute("dto", service.editView(bno));
		return "board/edit"; // board/edit.jsp 화면으로 이동
	}
	// ■ 4. 글 수정 기능
	@RequestMapping(value="/board/edit.do", method=RequestMethod.POST)
	public String edit_post(BoardDto dto, RedirectAttributes rttr) {
		String result = "글수정 실패";
		String returnPath = "";
		
		// 1. 사용자가 입력한 비밀번호가 DB와 일치하는지 먼저 검증합니다.
		if (service.checkPass(dto.getBno(), dto.getBpass())) {
			// 2. 비밀번호가 맞다면 수정을 진행합니다.
			if (service.update(dto) > 0) {
				result = "글수정 성공";
				returnPath = "redirect:/board/detail.do?bno=" + dto.getBno();
			} else {
				result = "글수정 실패 (시스템 오류)";
				returnPath = "redirect:/board/list.do";
			}
		} else {
			// 3. 비밀번호가 안 맞을 때 처리
			result = "비밀번호가 일치하지 않습니다.";
			// 알림창을 띄우기 위해 list.do로 리다이렉트 시킵니다. 
			returnPath = "redirect:/board/list.do"; 
		}
		
		rttr.addFlashAttribute("result", result);
		return returnPath; 
	}
	
	// ■ 5. 글 삭제폼 경로
	// 테스트 : http://localhost:8282/spring003_mvc/board/delete.do
	@RequestMapping(value="/board/delete.do", method=RequestMethod.GET)
	public String delete(@RequestParam("bno") int bno, Model model) {
		model.addAttribute("bno", bno);
		return "board/delete";
	}
	
	// ■ 5. 글 삭제 기능
		@RequestMapping(value="/board/delete.do", method=RequestMethod.POST)
		public String delete_post(@RequestParam("bno") int bno, 
		                          @RequestParam("bpass") String bpass, 
		                          RedirectAttributes rttr) {
			String result = "글삭제 실패";
			
			// 1. 비밀번호 검증
			if (service.checkPass(bno, bpass)) {
				// 2. 삭제용 DTO 객체를 생성하여 bno를 세팅합니다.
				BoardDto dto = new BoardDto();
				dto.setBno(bno);
				
				// 3. DTO를 인자로 받는 service.delete(dto)를 호출합니다.
				if(service.delete(dto) > 0) {
					result = "글삭제 성공";
				} else {
					result = "글삭제 실패 (시스템 오류)";
				}
				} else {
				result = "비밀번호가 일치하지 않습니다.";
				}
			
				rttr.addFlashAttribute("result", result);
				return "redirect:/board/list.do";
			}
}