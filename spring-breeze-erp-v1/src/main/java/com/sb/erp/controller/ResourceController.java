package com.sb.erp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.sb.erp.dao.AuthMapper;
import com.sb.erp.dto.AuthUserDto;
import com.sb.erp.dto.ResourceDto;
import com.sb.erp.security.CustomUser;
import com.sb.erp.service.ResourceService;
import com.sb.erp.util.PagingUtil;

@Controller
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthMapper authMapper;

    private static final int PAGE_SIZE = 10;

    @RequestMapping(value = "/resv/list", method = RequestMethod.GET)
    public String list(@RequestParam(value = "keyword", required = false) String keyword,
                       @RequestParam(value = "resType", required = false) String resType,
                       @RequestParam(value = "page", required = false, defaultValue = "1") int curPage,
                       @RequestParam(value = "error", required = false) String error,
                       HttpSession session,
                       Model model) {

        int comId = 1;

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", comId);
        paramMap.put("keyword", keyword);
        paramMap.put("resType", resType);

        int totalCount = resourceService.getResourceCount(paramMap);
        PagingUtil paging = new PagingUtil(totalCount, PAGE_SIZE, curPage);

        paramMap.put("startRow", paging.getPstartno());
        paramMap.put("pageSize", paging.getOnepagelist());

        List<ResourceDto> resourceList = resourceService.getResourceList(paramMap);

        model.addAttribute("resourceList", resourceList);
        model.addAttribute("paging", paging);
        model.addAttribute("keyword", keyword);
        model.addAttribute("resType", resType);
        model.addAttribute("error", error);

        return "resv/list";
    }

    @RequestMapping("/resv/detail")
    public String detail(@RequestParam("id") int resId,
                         @RequestParam(value = "error", required = false) String error,
                         Model model) {
        ResourceDto resourceDto = resourceService.getResourceDetail(resId);
        model.addAttribute("resource", resourceDto);
        model.addAttribute("error", error);
        return "resv/detail";
    }

    @RequestMapping(value = "/resv/insert", method = RequestMethod.GET)
    public String insertForm() {
        return "resv/insert";
    }

    @RequestMapping(value = "/resv/insert", method = RequestMethod.POST)
    public String insert(ResourceDto resourceDto, HttpSession session) {
        int comId = 1;
        resourceDto.setComId(comId);

        resourceService.insertResource(resourceDto);
        return "redirect:/resv/list";
    }

    @RequestMapping(value = "/resv/update", method = RequestMethod.GET)
    public String updateForm(@RequestParam("id") int resId, Model model) {
        ResourceDto resourceDto = resourceService.getResourceDetail(resId);
        model.addAttribute("resource", resourceDto);
        return "resv/update";
    }

    @RequestMapping(value = "/resv/update", method = RequestMethod.POST)
    public String update(ResourceDto resourceDto) {
        resourceService.updateResource(resourceDto);
        return "redirect:/resv/list";
    }

    @RequestMapping(value = "/resv/delete", method = RequestMethod.POST)
    public String delete(@RequestParam("id") int resId,
                         @RequestParam("password") String inputPassword,
                         @RequestParam(value = "returnTo", required = false, defaultValue = "list") String returnTo) {

        if (!matchesCurrentUserPassword(inputPassword)) {
            return buildDeleteRedirect(returnTo, resId, "badPassword");
        }

        if (resourceService.countReservationsByResourceId(resId) > 0) {
            return buildDeleteRedirect(returnTo, resId, "hasReservations");
        }

        resourceService.deleteResource(resId);
        return "redirect:/resv/list";
    }

    private boolean matchesCurrentUserPassword(String inputPassword) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUser)) {
            return false;
        }

        CustomUser loginUser = (CustomUser) auth.getPrincipal();
        String submittedPassword = inputPassword == null ? "" : inputPassword.trim();
        if (submittedPassword.isEmpty()) {
            return false;
        }

        String encodedPassword = loginUser.getPassword();
        String username = auth.getName();
        if (username != null && !username.trim().isEmpty()) {
            AuthUserDto authUserDto = authMapper.readAuth(username);
            if (authUserDto != null && authUserDto.getEmpPass() != null && !authUserDto.getEmpPass().trim().isEmpty()) {
                encodedPassword = authUserDto.getEmpPass();
            }
        }

        return encodedPassword != null && passwordEncoder.matches(submittedPassword, encodedPassword);
    }

    private String buildDeleteRedirect(String returnTo, int resId, String error) {
        if ("detail".equals(returnTo)) {
            return "redirect:/resv/detail?id=" + resId + "&error=" + error;
        }
        return "redirect:/resv/list?error=" + error;
    }
}
