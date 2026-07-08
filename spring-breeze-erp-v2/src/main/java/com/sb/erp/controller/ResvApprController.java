package com.sb.erp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.sb.erp.dto.ResvDto;
import com.sb.erp.dto.ResvSearchDto;
import com.sb.erp.dto.StatsResvDto;
import com.sb.erp.security.CustomUserDetails;
import com.sb.erp.service.ReservationService;
import com.sb.erp.util.PagingUtil;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/resv/appr")
public class ResvApprController {
    @Autowired private ReservationService service;

    @RequestMapping("/list")
    public String list(ResvSearchDto search, Model model, Authentication auth) {
    	// 현재 로그인 사용자 정보
    	CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
    	search.setComId(user.getUser().getComId());

    	if (search.getStartDt() == null || search.getStartDt().isBlank()) {
    		search.setStartDt(java.time.LocalDate.now().minusDays(30).toString());
        }
        if (search.getEndDt() == null || search.getEndDt().isBlank()) {
        	search.setEndDt(java.time.LocalDate.now().toString());
        }
    	
        int listtotal = service.getResvCount(search);
        PagingUtil paging = new PagingUtil(listtotal, search.getPstartno());
        List<ResvDto> list = service.getResvList(search);
        StatsResvDto stats = service.countByStats(search);

        model.addAttribute("list", list);
        model.addAttribute("search", search);
        model.addAttribute("paging", paging);
        
        model.addAttribute("totalCount", stats.getResvTotal());
        model.addAttribute("waitCount", stats.getWaiTotal());
        model.addAttribute("approveCount", stats.getAppTotal());
        model.addAttribute("rejectCount", stats.getRejTotal());

        return "resv/appr/list";
    }

    @PostMapping("/approve")
    public String approve(ResvDto resvDto, Authentication auth) {
    	// 현재 로그인 사용자 정보
    	CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
    	resvDto.setApprovedEmpId(user.getUser().getEmpId());
    	
    	int result = service.updateApprove(resvDto);
        return "redirect:/resv/appr/list";
    }

    @PostMapping("/reject")
    public String reject(ResvDto resvDto, Authentication auth) {
    	// 현재 로그인 사용자 정보
    	CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
    	resvDto.setApprovedEmpId(user.getUser().getEmpId());

        int result = service.updateReject(resvDto);
        return "redirect:/resv/appr/list";
    }
}
