package com.sb.erp.controller;

import java.security.Principal;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.ResSearchDto;
import com.sb.erp.dto.ResourceDto;
import com.sb.erp.service.EmpService;
import com.sb.erp.service.ReservationService;
import com.sb.erp.service.ResourceService;
import com.sb.erp.util.PagingUtil;

@Controller
public class ResourceController {
    @Autowired private ResourceService service;
    @Autowired private ReservationService resvService;
    @Autowired private EmpService empService;
    @Autowired private BCryptPasswordEncoder passwordEncoder;

    // 자원 관리 목록 페이지
    @RequestMapping(value = "/res/list", method = RequestMethod.GET)
    public String list(@RequestParam(value = "keyword", required = false) String keyword,
                       @RequestParam(value = "resType", required = false) String resType,
                       @RequestParam(value = "page", required = false, defaultValue = "1") int curPage,
                       @RequestParam(value = "error", required = false) String error,
                       HttpSession session,
                       Model model) {
    	ResSearchDto search = new ResSearchDto();
    	search.setComId((Integer) session.getAttribute("comId"));
    	search.setKeyword(keyword);
    	search.setResType(resType);
        
        int totalCount = service.getResourceCount(search);
        PagingUtil paging = new PagingUtil(totalCount, curPage);
        List<ResourceDto> resourceList = service.getResourceList(search);

        model.addAttribute("resourceList", resourceList);
        model.addAttribute("paging", paging);
        model.addAttribute("keyword", keyword);
        model.addAttribute("resType", resType);
        model.addAttribute("error", error);

        return "res/list";
    }

    // 자원 관리 상세 페이지
    @RequestMapping(value = "/res/detail", method = RequestMethod.GET)
    public String detail(@RequestParam("resId") int resId,
                         @RequestParam(value = "error", required = false) String error,
                         Model model) {
        ResourceDto resourceDto = service.getResourceDetail(resId);
        model.addAttribute("resource", resourceDto);
        model.addAttribute("error", error);
        return "res/detail";
    }

    // 자원 관리 등록 페이지
    @RequestMapping(value = "/res/insert", method = RequestMethod.GET)
    public String insertForm() {
        return "res/insert";
    }

    // 자원 관리 등록 기능
    @RequestMapping(value = "/res/insert", method = RequestMethod.POST)
    public String insert(ResourceDto resourceDto, HttpSession session) {
    	resourceDto.setComId((Integer) session.getAttribute("comId"));
    	service.insertResource(resourceDto);
        return "redirect:/res/list";
    }

    // 자원 관리 수정 페이지
    @RequestMapping(value = "/res/update", method = RequestMethod.GET)
    public String updateForm(@RequestParam("resId") int resId, Model model) {
        ResourceDto resourceDto = service.getResourceDetail(resId);
        model.addAttribute("resource", resourceDto);
        return "res/update";
    }

    // 자원 관리 수정 등록
    @RequestMapping(value = "/res/update", method = RequestMethod.POST)
    public String update(ResourceDto resourceDto) {
    	service.updateResource(resourceDto);
        return "redirect:/res/list";
    }

    // 자원 관리 삭제 기능
    @RequestMapping(value = "/res/delete", method = RequestMethod.POST)
    public String delete(@RequestParam("resId") int resId,
                         @RequestParam("empPass") String inputPassword,
                         @RequestParam(value = "returnTo", required = false, defaultValue = "list") String returnTo,
                         Principal prinicipal) {
    	// 현재 로그인 사용자 정보 prinicipal
    	String empEmail = prinicipal.getName();
    	EmpDto dto = empService.selectByEmpEmail(empEmail);

    	// 입력한 비밀번호와 저장된 비밀 번호가 불일치 (평문, 암호화)
    	if(!passwordEncoder.matches(inputPassword,dto.getEmpPass())) {
    		return buildDeleteRedirect(returnTo, resId, "badPassword");
    		
    	}
        // 예약 처리 중인 자원의 경우 삭제 불가
        if (resvService.countReservationsByResourceId(resId) > 0) {
            return buildDeleteRedirect(returnTo, resId, "hasReservations");
        }

        service.deleteResource(resId);
        return "redirect:/res/list";
    }

    private String buildDeleteRedirect(String returnTo, int resId, String error) {
        if ("detail".equals(returnTo)) {
            return "redirect:/res/detail?resId=" + resId + "&error=" + error;
        }
        return "redirect:/res/list?error=" + error;
    }
}
