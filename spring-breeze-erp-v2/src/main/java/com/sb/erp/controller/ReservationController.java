package com.sb.erp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.sb.erp.dto.ResSearchDto;
import com.sb.erp.dto.ResvDto;
import com.sb.erp.dto.ResDto;
import com.sb.erp.dto.ResvSearchDto;
import com.sb.erp.service.ReservationService;
import com.sb.erp.service.ResourceService;
import com.sb.erp.util.PagingUtil;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/resv")
public class ReservationController {
    @Autowired private ReservationService reservationService;
    @Autowired private ResourceService resourceService;

    @RequestMapping("/list")
    public String list(@RequestParam(value = "status", required = false) String status,
                       @RequestParam(value = "page", required = false, defaultValue = "1") int curPage,
                       @RequestParam(value = "error", required = false) String error,
                       HttpSession session,
                       Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = hasAdminAuthority(auth);

        ResvSearchDto search = new ResvSearchDto();
        search.setComId(getLoginComId(session));
        search.setStatus(status);
        search.setPstartno(curPage);
        if (!isAdmin) {
            search.setEmpId(getLoginEmpId(session));
        }

        int totalCount = reservationService.getReservationCount(search);
        PagingUtil paging = new PagingUtil(totalCount, curPage);
        List<ResvDto> reservationList = reservationService.getReservationList(search);

        model.addAttribute("reservationList", reservationList);
        model.addAttribute("paging", paging);
        model.addAttribute("status", status);
        model.addAttribute("error", error);
        model.addAttribute("isAdmin", isAdmin);
        model.addAttribute("loginEmpId", getLoginEmpId(session));
        model.addAttribute("roleLabel", isAdmin ? "ADMIN" : "USER");

        return "resv/reservationList";
    }

    @RequestMapping(value = "/insert", method = RequestMethod.GET)
    public String insertForm(@RequestParam(value = "resId", required = false) Integer resId,
                             HttpSession session,
                             Model model) {
        ResSearchDto search = buildResourceSearch(getLoginComId(session));
        List<ResDto> resourceList = resourceService.getResourceList(search);
        model.addAttribute("resourceList", resourceList);

        if (resId != null) {
            ResDto resourceDto = resourceService.getResourceDetail(resId);
            model.addAttribute("resource", resourceDto);
        }
        return "resv/reservationInsert";
    }

    @RequestMapping(value = "/insert", method = RequestMethod.POST)
    public String insert(ResvDto ResvDto, HttpSession session) {
        ResvDto.setComId(getLoginComId(session));
        ResvDto.setEmpId(getLoginEmpId(session));

        reservationService.insertReservation(ResvDto);
        return "redirect:/resv/list";
    }

    @RequestMapping(value = "/update", method = RequestMethod.GET)
    public String updateForm(@RequestParam("id") int revId,
                             HttpSession session,
                             Model model) {
        ResvDto ResvDto = reservationService.getReservationDetail(revId);
        if (!canManagePendingReservation(ResvDto, session)) {
            return "redirect:/resv/list?error=notAllowed";
        }

        model.addAttribute("reservation", ResvDto);
        model.addAttribute("resourceList", resourceService.getResourceList(buildResourceSearch(getLoginComId(session))));
        return "resv/reservationUpdate";
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public String update(ResvDto ResvDto, HttpSession session) {
        ResvDto original = reservationService.getReservationDetail(ResvDto.getRevId());
        if (!canManagePendingReservation(original, session)) {
            return "redirect:/resv/list?error=notAllowed";
        }

        ResvDto.setComId(original.getComId());
        ResvDto.setEmpId(original.getEmpId());
        ResvDto.setStatus(original.getStatus());
        reservationService.updateReservation(ResvDto);
        return "redirect:/resv/list";
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public String delete(@RequestParam("revId") int revId, HttpSession session) {
        ResvDto ResvDto = reservationService.getReservationDetail(revId);
        if (!canManagePendingReservation(ResvDto, session)) {
            return "redirect:/resv/list?error=notAllowed";
        }

        reservationService.deleteReservation(revId);
        return "redirect:/resv/list";
    }

    private ResSearchDto buildResourceSearch(int comId) {
        ResSearchDto search = new ResSearchDto();
        search.setComId(comId);
        search.setPstartno(1);
        search.setOnepagelist(100);
        return search;
    }

    private boolean canManagePendingReservation(ResvDto ResvDto, HttpSession session) {
        if (ResvDto == null) {
            return false;
        }
        if (ResvDto.getComId() != getLoginComId(session)) {
            return false;
        }
        if (!"WAI".equals(ResvDto.getStatus())) {
            return false;
        }
        return hasAdminAuthority(SecurityContextHolder.getContext().getAuthentication())
                || ResvDto.getEmpId() == getLoginEmpId(session);
    }

    private int getLoginComId(HttpSession session) {
        Object comId = session.getAttribute("comId");
        return comId instanceof Integer ? (Integer) comId : 1;
    }

    private int getLoginEmpId(HttpSession session) {
        Object empId = session.getAttribute("empId");
        return empId instanceof Integer ? (Integer) empId : 1;
    }

    private boolean hasAdminAuthority(Authentication auth) {
        if (auth == null || auth.getAuthorities() == null) {
            return false;
        }
        return auth.getAuthorities().stream()
                .filter(authority -> authority != null && authority.getAuthority() != null)
                .anyMatch(authority -> "ROOT".equals(authority.getAuthority()) || "ROLE_ADMIN".equals(authority.getAuthority()));
    }
}
