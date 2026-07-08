package com.sb.erp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.sb.erp.dto.ResSearchDto;
import com.sb.erp.dto.ResvDto;
import com.sb.erp.dto.ResDto;
import com.sb.erp.dto.ResvSearchDto;
import com.sb.erp.security.CustomUserDetails;
import com.sb.erp.service.ReservationService;
import com.sb.erp.service.ResourceService;
import com.sb.erp.util.PagingUtil;

@Controller
@RequestMapping("/resv")
public class ReservationController {
    @Autowired private ReservationService service;
    @Autowired private ResourceService resService;

    @GetMapping("/list")
    public String list(ResvSearchDto search, 
    				   Authentication auth, Model model) {
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

        model.addAttribute("list", list);
        model.addAttribute("paging", paging);
        model.addAttribute("search", search);

        return "resv/list";
    }

    @GetMapping("/insert")
    public String insertForm(Authentication auth, Model model) {
    	// 현재 로그인 사용자 정보
    	CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
    	
    	ResSearchDto search = new ResSearchDto();
    	search.setComId(user.getUser().getComId());
    	
    	// 예약 할 수 있는 회사의 자원 정보
    	// TODO: 자원 정보에 대해 더 디테일하게 갯수 체크 해야될 것 같음
        List<ResDto> resList = resService.getResListForResv(search);
        model.addAttribute("resList", resList);

        return "resv/insert";
    }

    @PostMapping("/insert")
    public String insert(Authentication auth, ResvDto resvDto) {
    	// 현재 로그인 사용자 정보
    	CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
    	resvDto.setEmpId(user.getUser().getEmpId());
    	resvDto.setComId(user.getUser().getComId());
    	
        service.insert(resvDto);
        return "redirect:/resv/list";
    }

}
