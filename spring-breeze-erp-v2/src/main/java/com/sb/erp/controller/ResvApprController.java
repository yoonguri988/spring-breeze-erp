package com.sb.erp.controller;

import java.util.List;

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

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/admin/approval")
public class ResvApprController {
    @Autowired private ReservationService resvService;

    @RequestMapping("/list")
    public String list(@RequestParam(value = "status", required = false) String status,
                       @RequestParam(value = "page", required = false, defaultValue = "1") int curPage,
                       HttpSession session,
                       Model model) {
        ResvSearchDto search = new ResvSearchDto();
        search.setComId(getLoginComId(session));
        search.setStatus(status);
        search.setPstartno(curPage);

        int totalCount = resvService.getReservationCount(search);
        PagingUtil paging = new PagingUtil(totalCount, curPage);
        List<ReservationDto> reservationList = resvService.getReservationList(search);
        StatsResvDto stats = resvService.countByStats(search);

        model.addAttribute("reservationList", reservationList);
        model.addAttribute("status", status);
        model.addAttribute("paging", paging);
        model.addAttribute("totalCount", stats.getResvTotal());
        model.addAttribute("waitCount", stats.getWaiTotal());
        model.addAttribute("approveCount", stats.getAppTotal());
        model.addAttribute("rejectCount", stats.getRejTotal());

        return "resv/approvalList";
    }

    @RequestMapping("/approve")
    public String approve(@RequestParam("revId") int revId) {
        resvService.updateStatus(revId, "APP", null);
        return "redirect:/admin/approval/list";
    }

    @RequestMapping("/reject")
    public String reject(@RequestParam("revId") int revId,
                         @RequestParam("rejectReason") String rejectReason) {
        if (rejectReason == null || rejectReason.trim().isEmpty()) {
            return "redirect:/admin/approval/list?error=noReason";
        }

        resvService.updateStatus(revId, "REJ", rejectReason);
        return "redirect:/admin/approval/list";
    }

    private int getLoginComId(HttpSession session) {
        Object comId = session.getAttribute("comId");
        return comId instanceof Integer ? (Integer) comId : 1;
    }
}
