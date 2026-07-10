package com.sb.erp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sb.erp.dto.EvalPeriodDto;
import com.sb.erp.dto.EvalPeriodSearchDto;
import com.sb.erp.service.EvalPeriodService;

@Controller
public class EvalPeriodController {
	@Autowired EvalPeriodService evalPeriodService;

	// ─── 회차 조회 ────────────────────────────────────
	// 목록 조회(필터)
	@GetMapping("/eval/period/list")
	public String list(EvalPeriodSearchDto search, Model model) {
		List<EvalPeriodDto> periodList = evalPeriodService.search(search);
		Map<String, Integer> stats = evalPeriodService.countByStatusAll();

		model.addAttribute("periodList", periodList);
		model.addAttribute("stats", stats);
		model.addAttribute("search", search);
		return "eval/period/list";
	}

	// 상세 조회
	@GetMapping("/eval/period/detail")
	public String detail(@RequestParam int periodId, Model model, RedirectAttributes ra) {
		EvalPeriodDto period = evalPeriodService.selectByPeriodId(periodId);

		if (period == null) {
			ra.addFlashAttribute("errorMsg", "존재하지 않는 회차입니다.");
			return "redirect:/eval/period/list";
		}

		int evalCount = evalPeriodService.countEvalsByPeriodId(periodId);
		int reportCount = evalPeriodService.countReportsByPeriodId(periodId);

		model.addAttribute("evalCount", evalCount);
		model.addAttribute("reportCount", reportCount);
		model.addAttribute("period", period);

		return "/eval/period/detail";
	}

	// ─── 회차 등록/수정 ────────────────────────────────

	// 회차 등록
	@GetMapping("/eval/period/add")
	public String addForm() {
		return "eval/period/add";
	}

	@PostMapping("/eval/period/add")
	public String addProcess(EvalPeriodDto dto, RedirectAttributes ra) {

		// 1. 중복 검사
		if (evalPeriodService.isDuplicate(dto.getEvalYear(), dto.getEvalTerm())) {
			ra.addFlashAttribute("prevInput", dto);
			ra.addFlashAttribute("errorMsg", "이미 등록된 회차입니다.");
			return "redirect:/eval/period/add";
		}

		// 2. 등록 처리
		int result = evalPeriodService.insert(dto);

		if (result <= 0) {
			ra.addFlashAttribute("prevInput", dto);
			ra.addFlashAttribute("errorMsg", "회차 등록에 실패했습니다.");
			return "redirect:/eval/period/add";
		}

		return "redirect:/eval/period/list";
	}

	// 회차 수정
	@GetMapping("/eval/period/edit")
	public String editForm(@RequestParam int periodId, Model model, RedirectAttributes ra) {
	    EvalPeriodDto period = evalPeriodService.selectByPeriodId(periodId);
	    
	    if (period == null) {
	        ra.addFlashAttribute("errorMsg", "존재하지 않는 회차입니다.");
	        return "redirect:/eval/period/list";
	    }
	    
	    model.addAttribute("period", period);
	    return "eval/period/edit";
	}

	@PostMapping("/eval/period/edit")
	public String editProcess(EvalPeriodDto dto, RedirectAttributes ra) {
	    EvalPeriodDto current = evalPeriodService.selectByPeriodId(dto.getPeriodId());
	    
	    if (current == null) {
	        ra.addFlashAttribute("errorMsg", "존재하지 않는 회차입니다.");
	        return "redirect:/eval/period/list";
	    }
	    
	    // evalYear, evalTerm은 원본 유지
	    dto.setEvalYear(current.getEvalYear());
	    dto.setEvalTerm(current.getEvalTerm());
	    int result = evalPeriodService.update(dto);
	    
	    if (result <= 0) {
	        ra.addFlashAttribute("prevInput", dto);
	        ra.addFlashAttribute("errorMsg", "회차 수정에 실패했습니다.");
	        return "redirect:/eval/period/list";
	    }
	    return "redirect:/eval/period/detail?periodId=" + dto.getPeriodId();
	}
	
	// 상태 변환 
	@PostMapping("/eval/period/open")
	public String openPeriod(@RequestParam int periodId, RedirectAttributes ra) {
	   
		int result = evalPeriodService.openPeriod(periodId);
		
		if (result == -1) {
		    ra.addFlashAttribute("errorMsg", "존재하지 않는 회차입니다.");
		    return "redirect:/eval/period/list";
		}
		
		if (result == -2) {
		    ra.addFlashAttribute("errorMsg", "READY 상태의 회차만 열 수 있습니다.");
		    return "redirect:/eval/period/detail?periodId=" + periodId;
		}
		
		ra.addFlashAttribute("successMsg", "회차를 열었습니다.");
		return "redirect:/eval/period/detail?periodId=" + periodId;
	}
	
	@PostMapping("/eval/period/close")
	public String closePeriod(@RequestParam int periodId, RedirectAttributes ra) {
	   
		int result = evalPeriodService.closePeriod(periodId);
		
		if (result == -1) {
		    ra.addFlashAttribute("errorMsg", "존재하지 않는 회차입니다.");
		    return "redirect:/eval/period/list";
		}
		
		if (result == -2) {
		    ra.addFlashAttribute("errorMsg", "OPEN 상태의 회차만 마감할 수 있습니다.");
		    return "redirect:/eval/period/detail?periodId=" + periodId;
		}
		
		ra.addFlashAttribute("successMsg", "회차를 마감했습니다.");
		return "redirect:/eval/period/detail?periodId=" + periodId;
	}
	
	@PostMapping("/eval/period/report")
	public String reportPeriod(@RequestParam int periodId, RedirectAttributes ra) {
	   
		int result = evalPeriodService.reportPeriod(periodId);
		
		if (result == -1) {
		    ra.addFlashAttribute("errorMsg", "존재하지 않는 회차입니다.");
		    return "redirect:/eval/period/list";
		}
		
		if (result == -2) {
		    ra.addFlashAttribute("errorMsg", "CLOSED 상태의 회차만 분석할 수 있습니다.");
		    return "redirect:/eval/period/detail?periodId=" + periodId;
		}
		
		ra.addFlashAttribute("successMsg", "AI 분석을 시작합니다.");
		return "redirect:/eval/period/detail?periodId=" + periodId;
	}


	// ─── 중복 확인 ────────────────────────────────────
	@GetMapping("/eval/period/checkDuplicate")
	@ResponseBody
	public Map<String, Object> checkDuplicate(@RequestParam int evalYear, @RequestParam String evalTerm) {
		Map<String, Object> result = new HashMap<>();
		result.put("duplicate", evalPeriodService.isDuplicate(evalYear, evalTerm));
		return result;							
	}


}