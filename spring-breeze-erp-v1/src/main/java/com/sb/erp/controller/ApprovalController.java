package com.sb.erp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.sb.erp.dto.ReservationDto;
import com.sb.erp.service.ReservationService;
import com.sb.erp.util.PagingUtil;

@Controller
@RequestMapping("/admin/approval")
public class ApprovalController {

    @Autowired
    private ReservationService reservationService;

    private static final int PAGE_SIZE = 10;

    @RequestMapping("/list")
    public String list(@RequestParam(value = "status", required = false) String status,
                       @RequestParam(value = "page", required = false, defaultValue = "1") int curPage,
                       HttpSession session,
                       Model model) {

        // TODO 로그인 세션 연동이 완료되면 session의 loginComId를 사용하면 됩니다.
        int comId = 1;

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", comId);
        paramMap.put("status", status);

        int totalCount = reservationService.getReservationCount(paramMap);
        PagingUtil paging = new PagingUtil(totalCount, PAGE_SIZE, curPage);

        paramMap.put("startRow", paging.getPstartno());
        paramMap.put("pageSize", paging.getOnepagelist());

        List<ReservationDto> reservationList = reservationService.getReservationList(paramMap);

        Map<String, Object> statMap = new HashMap<>();
        statMap.put("comId", comId);

        statMap.put("status", null);
        int totalAllCount = reservationService.countByStatus(statMap);

        statMap.put("status", "WAI");
        int waitCount = reservationService.countByStatus(statMap);

        statMap.put("status", "APP");
        int approveCount = reservationService.countByStatus(statMap);

        statMap.put("status", "REJ");
        int rejectCount = reservationService.countByStatus(statMap);

        model.addAttribute("reservationList", reservationList);
        model.addAttribute("paging", paging);
        model.addAttribute("status", status);
        model.addAttribute("totalCount", totalAllCount);
        model.addAttribute("waitCount", waitCount);
        model.addAttribute("approveCount", approveCount);
        model.addAttribute("rejectCount", rejectCount);

        return "resv/approvalList";
    }

    @RequestMapping("/approve")
    public String approve(@RequestParam("revId") int revId) {
        reservationService.updateStatus(revId, "APP", null);
        return "redirect:/admin/approval/list";
    }

    @RequestMapping("/reject")
    public String reject(@RequestParam("revId") int revId,
                         @RequestParam("rejectReason") String rejectReason) {

        if (rejectReason == null || rejectReason.trim().isEmpty()) {
            return "redirect:/admin/approval/list?error=noReason";
        }

        reservationService.updateStatus(revId, "REJ", rejectReason);
        return "redirect:/admin/approval/list";
    }
}
