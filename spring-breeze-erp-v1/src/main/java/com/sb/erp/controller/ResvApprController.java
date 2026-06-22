package com.sb.erp.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.sb.erp.dto.ReservationDto;
import com.sb.erp.dto.ResvSearchDto;
import com.sb.erp.dto.StatsResvDto;
import com.sb.erp.service.ReservationService;
import com.sb.erp.util.PagingUtil;

@Controller
@RequestMapping("/admin/approval")
public class ResvApprController {
    @Autowired private ReservationService resvService;

    // 자원 예약 승인 목록
    @RequestMapping("/list")
    public String list(@RequestParam(value = "status", required = false) String status,
                       @RequestParam(value = "page", required = false, defaultValue = "1") int curPage,
                       HttpSession session,
                       Model model) {
    	ResvSearchDto search = new ResvSearchDto();
    	search.setComId((Integer) session.getAttribute("comId"));
    	search.setStatus(status);
        int totalCount = resvService.getReservationCount(search);
        PagingUtil paging = new PagingUtil(totalCount, curPage);
        List<ReservationDto> reservationList = resvService.getReservationList(search);

        StatsResvDto stats = resvService.countByStats(search);
        // 통계 (전체/대기/승인/반려)
        model.addAttribute("reservationList", reservationList);
        model.addAttribute("stats", status);
        model.addAttribute("paging", paging);
        model.addAttribute("stats", stats);

        return "resv/apprlist";
    }

    // 자원 승인 기능
    @RequestMapping("/approve")
    public String approve(@RequestParam("revId") int revId) {
    	resvService.updateStatus(revId, "APP", null);
        return "redirect:/admin/approval/list";
    }

    // 자원 반려 기능
    @RequestMapping("/reject")
    public String reject(@RequestParam("revId") int revId,
                         @RequestParam("rejectReason") String rejectReason) {

        if (rejectReason == null || rejectReason.trim().isEmpty()) {
            return "redirect:/admin/approval/list?error=noReason";
        }

        resvService.updateStatus(revId, "REJ", rejectReason);
        return "redirect:/admin/approval/list";
    }
}
