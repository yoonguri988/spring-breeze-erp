package com.sb.erp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sb.erp.dto.ResourceDto;
import com.sb.erp.service.ResourceService;
import com.sb.erp.util.PagingUtil;

@Controller
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    private static final int PAGE_SIZE = 10; 

    
    @RequestMapping(value="/resv/list",method=RequestMethod.GET)
    public String list(@RequestParam(value = "keyword", required = false) String keyword,
                        @RequestParam(value = "resType", required = false) String resType,
                        @RequestParam(value = "page", required = false, defaultValue = "1") int curPage,
                        HttpSession session,
                        Model model) {


    	//Integer loginComId = (Integer) session.getAttribute("loginComId");


    	int comId = 1;


        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", comId);
        paramMap.put("keyword", keyword);
        paramMap.put("resType", resType);

   
        int totalCount = resourceService.getResourceCount(paramMap);
        PagingUtil paging = new PagingUtil(totalCount, PAGE_SIZE, curPage);

       
        paramMap.put("startRow", paging.getPstartno());   // DB 조회 시작 행
        paramMap.put("pageSize", paging.getOnepagelist());
       
        List<ResourceDto> resourceList = resourceService.getResourceList(paramMap);

      
        model.addAttribute("resourceList", resourceList);
        model.addAttribute("paging", paging);
        model.addAttribute("keyword", keyword);
        model.addAttribute("resType", resType);

        return "resv/list";
    }

    //(상세)
    @RequestMapping("/resv/detail")
    public String detail(@RequestParam("id") int resId, Model model) {
        ResourceDto resourceDto = resourceService.getResourceDetail(resId);
        model.addAttribute("resource", resourceDto);
        return "resv/detail";
    }

    //(등록)보여지는 페이지 뷰단 
    @RequestMapping(value = "/resv/insert", method = RequestMethod.GET)
    public String insertForm() {
        return "/resv/insert";
    }

   //(등록)실제 사용하는 기능
    @RequestMapping(value = "/resv/insert", method = RequestMethod.POST)
    public String insert(ResourceDto resourceDto, HttpSession session) {
        
    	int comId = 1;
       // int comId = (Integer) session.getAttribute("loginComId");
        resourceDto.setComId(comId);

        resourceService.insertResource(resourceDto);
        return "redirect:/resv/list";
    }

    //(수정)
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

    
    @RequestMapping("/delete")
    public String delete(@RequestParam("id") int resId) {
        resourceService.deleteResource(resId);
        return "redirect:/resv/list";
    }
    
    /**
     * <!-- JYT -->
    // ============================================
    // 자원 삭제 - 관리자 비밀번호 재인증 방식
    // ============================================
 
   
     * 비밀번호 검증 후 삭제까지 한 번에 처리.
     * 프론트(JS)에서 fetch/ajax로 비밀번호와 resId를 함께 전송하고,
     * 응답 JSON의 success 값으로 성공/실패를 판단해서 화면을 갱신하는 방식.
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private ResourceService resourceservice;
    
    
    @RequestMapping(value = "/resv/deleteWithAuth", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> deleteWithAuth(@RequestParam("id") int resId,
                                               @RequestParam("password") String inputPassword) {
        Map<String, Object> result = new HashMap<>();
 
        // 1. 현재 로그인한 관리자 정보 가져오기 (Spring Security)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        // TODO: 실제 CustomUser/CustomUserDetailsService 구조에 맞게
        //       암호화된 비밀번호를 가져오는 부분을 채워야 함.
        //       예: CustomUser loginUser = (CustomUser) auth.getPrincipal();
        //           String encodedPassword = loginUser.getPassword();
        String encodedPassword = "여기에 로그인한 관리자의 암호화된 비밀번호를 가져와야 함";
 
        // 2. 입력한 비밀번호와 암호화된 비밀번호 비교 (BCrypt)
        boolean isMatch = passwordEncoder.matches(inputPassword, encodedPassword);
 
        if (!isMatch) {
            // 비밀번호가 틀리면 삭제하지 않고 실패 응답
            result.put("success", false);
            result.put("message", "비밀번호가 일치하지 않습니다.");
            return result;
        }
 
        // 3. 비밀번호가 맞으면 실제 삭제 진행
        resourceService.deleteResource(resId);
 
        result.put("success", true);
        result.put("message", "삭제되었습니다.");
        return result;
    }
     */
}