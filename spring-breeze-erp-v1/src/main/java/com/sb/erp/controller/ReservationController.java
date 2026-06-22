package com.sb.erp.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.sb.erp.dto.ResSearchDto;
import com.sb.erp.dto.ReservationDto;
import com.sb.erp.dto.ResourceDto;
import com.sb.erp.dto.ResvSearchDto;
import com.sb.erp.service.ReservationService;
import com.sb.erp.service.ResourceService;
import com.sb.erp.util.PagingUtil;

@Controller
@RequestMapping("/resv")
public class ReservationController {
    @Autowired private ReservationService reservationService;
    @Autowired private ResourceService resourceService;

    // 자원 예약 관리 목록
    @RequestMapping("/list")
    public String list(@RequestParam(value = "status", required = false) String status,
                       @RequestParam(value = "page", required = false, defaultValue = "1") int curPage,
                       HttpSession session,
                       Model model) {
    	ResvSearchDto search = new ResvSearchDto();
    	search.setComId((Integer) session.getAttribute("comId"));
    	search.setStatus(status);
    	
        int totalCount = reservationService.getReservationCount(search);
        List<ReservationDto> reservationList = reservationService.getReservationList(search);

        PagingUtil paging = new PagingUtil(totalCount, curPage);
        
        model.addAttribute("reservationList", reservationList);
        model.addAttribute("paging", paging);
        model.addAttribute("status", status);

        return "resv/list";
    }

    // 자원 예약 등록 폼
    @RequestMapping(value = "/insert", method = RequestMethod.GET)
    public String insertForm(@RequestParam(value = "resId", required = false) Integer resId,
                             HttpSession session,
                             Model model) {
    	ResSearchDto search = new ResSearchDto();
    	search.setComId((Integer) session.getAttribute("comId"));

        List<ResourceDto> resourceList = resourceService.getResourceList(search);
        model.addAttribute("resourceList", resourceList);

        if (resId != null) {
            ResourceDto resourceDto = resourceService.getResourceDetail(resId);
            model.addAttribute("resource", resourceDto);
        }
        return "resv/insert";
    }

    // 자원 예약 등록 기능
    @RequestMapping(value = "/insert", method = RequestMethod.POST)
    public String insert(ReservationDto reservationDto, HttpSession session) {
        Integer comId = (Integer) session.getAttribute("comId");
        Integer empId = (Integer) session.getAttribute("empId");

        reservationDto.setComId(comId);
        reservationDto.setEmpId(empId);

        reservationService.insertReservation(reservationDto);
        return "redirect:/resv/list";
    }
    
    // 자원 예약 수정 폼
    // 자원 예약 수정 기능
    // 자원 예약 삭제 폼
    // 자원 예약 삭제 기능
}
