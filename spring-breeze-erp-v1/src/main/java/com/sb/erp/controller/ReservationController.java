package com.sb.erp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.sb.erp.dto.ReservationDto;
import com.sb.erp.dto.ResourceDto;
import com.sb.erp.service.ReservationService;
import com.sb.erp.service.ResourceService;
import com.sb.erp.util.PagingUtil;

@Controller
@RequestMapping("/reservation")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ResourceService resourceService;

    private static final int PAGE_SIZE = 10;

    @RequestMapping("/list")
    public String list(@RequestParam(value = "status", required = false) String status,
                       @RequestParam(value = "page", required = false, defaultValue = "1") int curPage,
                       HttpSession session,
                       Model model) {

        int comId = getLoginComId(session);

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", comId);
        paramMap.put("status", status);

        int totalCount = reservationService.getReservationCount(paramMap);
        PagingUtil paging = new PagingUtil(totalCount, PAGE_SIZE, curPage);

        paramMap.put("startRow", paging.getPstartno());
        paramMap.put("pageSize", paging.getOnepagelist());
        List<ReservationDto> reservationList = reservationService.getReservationList(paramMap);

        model.addAttribute("reservationList", reservationList);
        model.addAttribute("paging", paging);
        model.addAttribute("status", status);

        return "resv/reservationList";
    }

    @RequestMapping(value = "/insertForm", method = RequestMethod.GET)
    public String insertForm(@RequestParam(value = "resId", required = false) Integer resId,
                             HttpSession session,
                             Model model) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", getLoginComId(session));
        paramMap.put("keyword", null);
        paramMap.put("resType", null);
        paramMap.put("startRow", 0);
        paramMap.put("pageSize", 100);

        List<ResourceDto> resourceList = resourceService.getResourceList(paramMap);
        model.addAttribute("resourceList", resourceList);

        if (resId != null) {
            ResourceDto resourceDto = resourceService.getResourceDetail(resId);
            model.addAttribute("resource", resourceDto);
        }
        return "resv/reservationInsert";
    }

    @RequestMapping(value = "/insert", method = RequestMethod.POST)
    public String insert(ReservationDto reservationDto, HttpSession session) {

        int comId = getLoginComId(session);
        int empId = getLoginEmpId(session);

        reservationDto.setComId(comId);
        reservationDto.setEmpId(empId);

        reservationService.insertReservation(reservationDto);
        return "redirect:/reservation/list";
    }

    private int getLoginComId(HttpSession session) {
        Object comId = session.getAttribute("loginComId");
        return comId instanceof Integer ? (Integer) comId : 1;
    }

    private int getLoginEmpId(HttpSession session) {
        Object empId = session.getAttribute("loginEmpId");
        return empId instanceof Integer ? (Integer) empId : 1;
    }
}
