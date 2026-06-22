package com.sb.erp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
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
import com.sb.erp.service.ReservationService;
import com.sb.erp.service.ResourceService;
import com.sb.erp.util.PagingUtil;

/*
 * 자원 관리 컨트롤러
 * - URL 기본 경로 : /resv
 * - 자원(회의실 / 장비) 목록 조회 / 상세 / 등록 / 수정 / 삭제 기능 담당
 * - 등록 / 수정 / 삭제는 관리자(ADMIN / ROOT)만 접근 가능
 * - 삭제 시 비밀번호 재확인 + 연결된 예약 존재 여부 검증 수행
 */
@Controller
public class ResourceController {

    // 한 페이지에 보여줄 자원 목록 건수
    private static final int PAGE_SIZE = 10;

    // 자원 관련 비즈니스 로직 처리 서비스
    @Autowired
    private ResourceService resourceService;

    // 삭제 시 연결된 예약 건수 확인용 서비스
    @Autowired
    private ReservationService reservationService;

    // 삭제 시 비밀번호 재확인에 사용하는 BCrypt 암호화 도구
    @Autowired
    private PasswordEncoder passwordEncoder;

    // DB에서 로그인 사용자의 최신 비밀번호를 조회하는 Mapper
    // (CustomUser 세션 비밀번호가 변경 후 갱신이 안 될 수 있어 DB에서 직접 조회)
    @Autowired
    private AuthMapper authMapper;

    /*
     * 자원 목록 조회
     * - 키워드 검색 / 자원 타입 필터 / 페이징 지원
     * - 상단 통계 카드 3종 (전체 / 회의실 / 장비 건수) 데이터도 함께 전달
     * - 관리자 여부에 따라 JSP에서 등록 / 수정 / 삭제 버튼 show/hide 처리
     *
     * @param keyword  검색어 (자원명 또는 코드), 없으면 전체 조회
     * @param resType  자원 타입 필터 (ROOM / EQUIPMENT), 없으면 전체 조회
     * @param curPage  현재 페이지 번호 (기본값 1)
     * @param error    에러 코드 (예: adminOnly), JSP에서 에러 메시지 표시용
     */
    @RequestMapping(value = "/resv/list", method = RequestMethod.GET)
    public String list(@RequestParam(value = "keyword", required = false) String keyword,
                       @RequestParam(value = "resType", required = false) String resType,
                       @RequestParam(value = "page", required = false, defaultValue = "1") int curPage,
                       @RequestParam(value = "error", required = false) String error,
                       HttpSession session,
                       Model model) {

        // Spring Security 인증 객체 가져오기 (관리자 여부 판단에 사용)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int comId = getLoginComId(session);
        boolean isAdmin = hasAdminAuthority(auth);

        // DB 조회 조건을 담는 Map (MyBatis mapper에 파라미터로 전달)
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", comId);       // 같은 회사 데이터만 조회
        paramMap.put("keyword", keyword);   // 검색어 (null이면 전체)
        paramMap.put("resType", resType);   // 타입 필터 (null이면 전체)

        // 전체 자원 건수 조회 (페이징 계산에 필요)
        int totalCount = resourceService.getResourceCount(paramMap);

        // PagingUtil : 전체건수, 페이지당 건수, 현재 페이지로 LIMIT 시작값 계산
        // 생성자 순서 : (전체건수, 페이지당 건수, 현재 페이지)
        PagingUtil paging = new PagingUtil(totalCount, PAGE_SIZE, curPage);

        // LIMIT 조건 추가 : startRow(시작 위치)와 pageSize(가져올 건수)
        paramMap.put("startRow", paging.getPstartno());
        paramMap.put("pageSize", paging.getOnepagelist());

        // 페이징 조건이 적용된 자원 목록 조회
        List<ResourceDto> resourceList = resourceService.getResourceList(paramMap);

        // JSP에 전달할 데이터 세팅
        model.addAttribute("resourceList", resourceList);   // 자원 목록
        model.addAttribute("paging", paging);               // 페이징 정보
        model.addAttribute("keyword", keyword);             // 검색어 유지 (폼 기본값용)
        model.addAttribute("resType", resType);             // 타입 필터 유지
        model.addAttribute("error", error);                 // 에러 메시지 코드
        model.addAttribute("isAdmin", isAdmin);             // 관리자 여부 (버튼 show/hide용)
        model.addAttribute("roleLabel", isAdmin ? "ADMIN" : "USER"); // 화면에 표시할 권한 라벨

        // 상단 통계 카드용 건수 (전체 / 회의실 / 장비)
        // countResourcesByType(comId, null) : 타입 조건 없이 전체 건수
        model.addAttribute("totalResourceCount",     resourceService.countResourcesByType(comId, null));
        model.addAttribute("roomResourceCount",      resourceService.countResourcesByType(comId, "ROOM"));
        model.addAttribute("equipmentResourceCount", resourceService.countResourcesByType(comId, "EQUIPMENT"));

        return "resv/list"; // /view/resv/list.jsp
    }

    /*
     * 자원 상세 조회
     * - resId로 자원 데이터를 조회해서 상세 화면에 전달
     * - 자원이 존재하지 않으면 목록으로 리다이렉트 (notFound 에러)
     * - 관리자 여부에 따라 JSP에서 수정 / 삭제 버튼 show/hide 처리
     *
     * @param resId  조회할 자원 ID
     * @param error  에러 코드 (삭제 실패 등), JSP에서 에러 메시지 표시용
     */
    @RequestMapping("/resv/detail")
    public String detail(@RequestParam("id") int resId,
                         @RequestParam(value = "error", required = false) String error,
                         HttpSession session,
                         Model model) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // 자원 상세 데이터 조회 (같은 회사 데이터만 조회되도록 comId 함께 전달)
        ResourceDto resourceDto = resourceService.getResourceDetail(getLoginComId(session), resId);

        // 자원이 없으면 (잘못된 ID 또는 다른 회사 자원 접근 시도) 목록으로 이동
        if (resourceDto == null) {
            return "redirect:/resv/list?error=notFound";
        }

        boolean isAdmin = hasAdminAuthority(auth);

        // JSP에 전달할 데이터 세팅
        model.addAttribute("resource", resourceDto);                 // 자원 상세 데이터
        model.addAttribute("error", error);                          // 에러 메시지 코드
        model.addAttribute("isAdmin", isAdmin);                      // 관리자 여부 (버튼 show/hide용)
        model.addAttribute("roleLabel", isAdmin ? "ADMIN" : "USER"); // 화면에 표시할 권한 라벨

        return "resv/detail"; // /view/resv/detail.jsp
    }

    /*
     * 자원 등록 폼 화면 (GET)
     * - 관리자만 접근 가능 (일반 사용자 접근 시 목록으로 리다이렉트)
     *
     * @param error  에러 코드 (예: duplicateCode), JSP에서 에러 메시지 표시용
     */
    @RequestMapping(value = "/resv/insert", method = RequestMethod.GET)
    public String insertForm(@RequestParam(value = "error", required = false) String error, Model model) {

        // 관리자 권한 체크 : 비관리자면 목록으로 차단
        if (!hasAdminAuthority(SecurityContextHolder.getContext().getAuthentication())) {
            return "redirect:/resv/list?error=adminOnly";
        }

        model.addAttribute("error", error); // 에러 메시지 코드 (중복코드 등)

        return "resv/insert"; // /view/resv/insert.jsp
    }

    /*
     * 자원 등록 처리 (POST)
     * - 관리자만 처리 가능
     * - 같은 회사 내 자원 코드 중복 여부 체크 후 DB에 저장
     * - 중복 코드이면 등록 폼으로 리다이렉트 (에러 파라미터 전달)
     */
    @RequestMapping(value = "/resv/insert", method = RequestMethod.POST)
    public String insert(ResourceDto resourceDto, HttpSession session) {

        // 관리자 권한 체크 : 비관리자면 목록으로 차단
        if (!hasAdminAuthority(SecurityContextHolder.getContext().getAuthentication())) {
            return "redirect:/resv/list?error=adminOnly";
        }

        int comId = getLoginComId(session);
        // 클라이언트에서 받은 DTO에 로그인 회사ID 주입 (화면 위조 방지)
        resourceDto.setComId(comId);

        // 자원 코드 중복 체크 : 같은 회사 내에 동일한 코드가 있으면 등록 불가
        // countResourceCode(comId, resCode, excludeResId) : excludeResId가 null이면 자기 자신 제외 없이 전체 검색
        if (resourceService.countResourceCode(comId, resourceDto.getResCode(), null) > 0) {
            return "redirect:/resv/insert?error=duplicateCode";
        }

        resourceService.insertResource(resourceDto);

        return "redirect:/resv/list"; // 등록 후 목록으로 이동
    }

    /*
     * 자원 수정 폼 화면 (GET)
     * - 관리자만 접근 가능
     * - resId로 기존 자원 데이터를 조회해서 폼에 채워 넣기
     * - 자원이 없으면 목록으로 리다이렉트 (notFound 에러)
     *
     * @param resId  수정할 자원 ID
     * @param error  에러 코드 (예: duplicateCode), JSP에서 에러 메시지 표시용
     */
    @RequestMapping(value = "/resv/update", method = RequestMethod.GET)
    public String updateForm(@RequestParam("id") int resId,
                             @RequestParam(value = "error", required = false) String error,
                             HttpSession session,
                             Model model) {

        // 관리자 권한 체크
        if (!hasAdminAuthority(SecurityContextHolder.getContext().getAuthentication())) {
            return "redirect:/resv/list?error=adminOnly";
        }

        // 수정 대상 자원 데이터 조회
        ResourceDto resourceDto = resourceService.getResourceDetail(getLoginComId(session), resId);

        // 자원이 없으면 목록으로 리다이렉트
        if (resourceDto == null) {
            return "redirect:/resv/list?error=notFound";
        }

        // JSP에 전달할 데이터 세팅
        model.addAttribute("resource", resourceDto); // 기존 자원 데이터 (폼 기본값 세팅용)
        model.addAttribute("error", error);          // 에러 메시지 코드
        model.addAttribute("isAdmin", true);         // 수정 폼은 관리자만 진입 → 항상 true
        model.addAttribute("roleLabel", "ADMIN");    // 권한 라벨 고정

        return "resv/update"; // /view/resv/update.jsp
    }

    /*
     * 자원 수정 처리 (POST)
     * - 관리자만 처리 가능
     * - DB에서 원본 자원 데이터를 다시 조회해 존재 여부 검증 (위조 방지)
     * - 자원 코드 중복 체크 시 자기 자신(resId)은 제외하고 비교
     * - 처리 완료 후 자원 목록으로 리다이렉트
     *
     * @param resId  수정할 자원 ID (hidden 필드로 전달)
     */
    @RequestMapping(value = "/resv/update", method = RequestMethod.POST)
    public String update(@RequestParam("resId") int resId, ResourceDto resourceDto, HttpSession session) {

        // 관리자 권한 체크
        if (!hasAdminAuthority(SecurityContextHolder.getContext().getAuthentication())) {
            return "redirect:/resv/list?error=adminOnly";
        }

        int comId = getLoginComId(session);

        // 수정 권한 검증을 위해 DB에서 원본 데이터를 다시 조회 (존재 여부 확인)
        ResourceDto original = resourceService.getResourceDetail(comId, resId);
        if (original == null) {
            return "redirect:/resv/list?error=notFound";
        }

        // 폼에서 받은 DTO에 resId, comId 주입 (화면에서 임의로 바꾸는 위조 방지)
        resourceDto.setResId(resId);
        resourceDto.setComId(comId);

        // 자원 코드 중복 체크 : 자기 자신(resId)은 제외하고 나머지 중 동일 코드 있으면 수정 불가
        if (resourceService.countResourceCode(comId, resourceDto.getResCode(), resId) > 0) {
            return "redirect:/resv/update?id=" + resId + "&error=duplicateCode";
        }

        resourceService.updateResource(resourceDto);

        return "redirect:/resv/list"; // 수정 후 목록으로 이동
    }

    /*
     * 자원 삭제 처리 (POST)
     * - 관리자만 처리 가능
     * - 삭제 전 3단계 검증 수행
     *   1단계 : 관리자 권한 체크
     *   2단계 : 비밀번호 재확인 (BCrypt 매칭)
     *   3단계 : 연결된 예약 건수 확인 (예약이 있으면 삭제 불가)
     * - 삭제 성공 후 자원 목록으로 리다이렉트
     * - 실패 시 returnTo 값에 따라 목록 또는 상세 화면으로 리다이렉트
     *
     * @param resId         삭제할 자원 ID
     * @param inputPassword 관리자가 입력한 현재 비밀번호 (삭제 확인 모달에서 전달)
     * @param returnTo      삭제 실패 시 돌아갈 화면 (list / detail, 기본값 list)
     */
    @RequestMapping(value = "/resv/delete", method = RequestMethod.POST)
    public String delete(@RequestParam("id") int resId,
                         @RequestParam("password") String inputPassword,
                         @RequestParam(value = "returnTo", required = false, defaultValue = "list") String returnTo,
                         HttpSession session) {

        // 1단계 : 관리자 권한 체크
        if (!hasAdminAuthority(SecurityContextHolder.getContext().getAuthentication())) {
            return buildDeleteRedirect(returnTo, resId, "adminOnly");
        }

        int comId = getLoginComId(session);

        // 삭제 대상 자원 존재 여부 확인
        if (resourceService.getResourceDetail(comId, resId) == null) {
            return "redirect:/resv/list?error=notFound";
        }

        // 2단계 : 비밀번호 재확인 (입력한 비밀번호가 현재 로그인 계정과 일치하는지 BCrypt로 검증)
        if (!matchesCurrentUserPassword(inputPassword)) {
            return buildDeleteRedirect(returnTo, resId, "badPassword");
        }

        // 3단계 : 연결된 예약 건수 확인 (예약이 1건이라도 있으면 삭제 불가)
        if (reservationService.countReservationsByResourceId(comId, resId) > 0) {
            return buildDeleteRedirect(returnTo, resId, "hasReservations");
        }

        // 모든 검증 통과 → 자원 삭제 처리
        resourceService.deleteResource(comId, resId);

        return "redirect:/resv/list"; // 삭제 후 목록으로 이동
    }

    // ========================================================================
    // Private 헬퍼 메서드
    // ========================================================================

    /*
     * 세션에서 로그인 사용자의 회사ID(comId) 가져오기
     * - 세션에 값이 없거나 타입이 다르면 기본값 1 반환 (개발 환경용 폴백)
     *
     * @param session HTTP 세션
     * @return 로그인 회사ID (기본값 : 1)
     */
    private int getLoginComId(HttpSession session) {
        Object comId = session.getAttribute("loginComId");
        return comId instanceof Integer ? (Integer) comId : 1;
    }

    /*
     * 현재 로그인 사용자의 비밀번호 일치 여부 확인
     * - Spring Security의 CustomUser 세션 객체에서 비밀번호를 가져오되,
     *   비밀번호 변경 후 세션이 갱신되지 않을 수 있으므로 DB에서 최신 비밀번호를 다시 조회해 검증
     * - BCryptPasswordEncoder.matches()로 입력값과 암호화된 비밀번호를 비교
     *
     * @param inputPassword 사용자가 입력한 평문 비밀번호
     * @return 일치하면 true, 불일치 또는 비정상 상태이면 false
     */
    private boolean matchesCurrentUserPassword(String inputPassword) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // 인증 정보가 없거나 CustomUser 타입이 아니면 (비로그인 상태) false 반환
        if (auth == null || !(auth.getPrincipal() instanceof CustomUser)) {
            return false;
        }

        // 입력한 비밀번호가 null이거나 공백이면 false 반환
        String submittedPassword = inputPassword == null ? "" : inputPassword.trim();
        if (submittedPassword.isEmpty()) {
            return false;
        }

        CustomUser loginUser = (CustomUser) auth.getPrincipal();

        // 세션의 암호화된 비밀번호를 기본값으로 사용
        String encodedPassword = loginUser.getPassword();
        String username = auth.getName(); // 로그인 아이디 (사원번호 or 이메일)

        // DB에서 최신 비밀번호를 다시 조회 (비밀번호 변경 후 세션 갱신이 안 된 경우 대비)
        if (username != null && !username.trim().isEmpty()) {
            AuthUserDto authUserDto = authMapper.readAuth(username);
            // DB 조회 성공 시 최신 암호화 비밀번호로 교체
            if (authUserDto != null && authUserDto.getEmpPass() != null && !authUserDto.getEmpPass().trim().isEmpty()) {
                encodedPassword = authUserDto.getEmpPass();
            }
        }

        // BCrypt로 입력 비밀번호(평문)와 저장 비밀번호(암호화) 비교
        return encodedPassword != null && passwordEncoder.matches(submittedPassword, encodedPassword);
    }

    /*
     * 삭제 실패 시 리다이렉트 URL을 만들어 반환하는 헬퍼 메서드
     * - returnTo 값에 따라 목록 화면 또는 상세 화면으로 분기
     * - 상세 화면(detail)으로 돌아갈 때는 resId도 함께 전달
     *
     * @param returnTo  돌아갈 화면 구분값 (detail / list)
     * @param resId     현재 자원 ID (상세 화면 복귀 시 필요)
     * @param error     에러 코드 (badPassword / hasReservations / adminOnly 등)
     * @return 리다이렉트 URL 문자열
     */
    private String buildDeleteRedirect(String returnTo, int resId, String error) {
        if ("detail".equals(returnTo)) {
            // 상세 화면에서 삭제 실패 → 상세 화면으로 돌아가며 에러 표시
            return "redirect:/resv/detail?id=" + resId + "&error=" + error;
        }
        // 목록 화면에서 삭제 실패 → 목록으로 돌아가며 에러 표시
        return "redirect:/resv/list?error=" + error;
    }

    /*
     * Spring Security에서 현재 로그인 사용자의 관리자 권한 여부 확인
     * - ROLE_ADMIN, ADMIN, ROOT 중 하나라도 있으면 관리자로 판단
     * - Authentication 객체가 null이거나 권한 목록이 없으면 false 반환
     *
     * @param auth Spring Security 인증 객체
     * @return 관리자이면 true, 아니면 false
     */
    private boolean hasAdminAuthority(Authentication auth) {

        // 인증 정보 자체가 없는 경우 (비로그인 상태)
        if (auth == null || auth.getAuthorities() == null) {
            return false;
        }

        // 부여된 권한 목록을 순회하며 관리자 권한 확인
        for (GrantedAuthority authority : auth.getAuthorities()) {

            // null 권한 항목은 건너뜀 (방어 코드)
            if (authority == null) {
                continue;
            }

            String role = authority.getAuthority();

            // ROLE_ADMIN(Spring Security 표준), ADMIN, ROOT 중 하나면 관리자
            if ("ROLE_ADMIN".equals(role) || "ADMIN".equals(role) || "ROOT".equals(role)) {
                return true;
            }
        }

        return false; // 관리자 권한 없음
    }
}