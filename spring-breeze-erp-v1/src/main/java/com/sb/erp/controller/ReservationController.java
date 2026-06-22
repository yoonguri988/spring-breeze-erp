package com.sb.erp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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


/*
 * 자원예약 컨트롤러
 * - URL 기본 경로 : /reservation
 * - 예약 등록/ 수정/ 삭제/ 목록 조회 기능 담당
 * - 일반 사용자 : 자신이 신청한 WAI( 대기) 예약만 수정, 삭제 가능
 * - 관리 사용자 ( ADMIN/ROOT ) : 모든 예약의 WAI 상태 수정, 삭제 가능
 */
@Controller
@RequestMapping("/reservation")
public class ReservationController {
	// 한 페이지에 보여줄 예약 목록 건수
    private static final int PAGE_SIZE = 10;
    
    // 예약 관련 비즈니스 로직 처리 서비스
    @Autowired
    private ReservationService reservationService;
    
    // 자원 목록 조회에 사용하는 서비스 ( 예약 폼에서 자원 선택용 )
    @Autowired
    private ResourceService resourceService;

    /*
     * 예약 목록 조회
     * - Get/ Post  모두 허용 (@RequestMapping)
     * - 관리자 : 회사 전체 예약 목록 조회
     * - 일반 사용자 : 자신의 예약만 조회 ( paramMap에 empId 추가)
     * - 상태 필터(status)와 페에징(page) 파라미터
     * 
     * @param status  필터 상태값 (WAI / APP / REJ), 없으면 전체 조회
     * @param curPage 현재 페이지 번호 (기본값 1)
     * @param error   에러 코드 (예: notAllowed), JSP에서 에러 메시지 표시용
     */
    @RequestMapping("/list")
    public String list(@RequestParam(value = "status", required = false) String status,
                       @RequestParam(value = "page", required = false, defaultValue = "1") int curPage,
                       @RequestParam(value = "error", required = false) String error,
                       HttpSession session,
                       Model model) {
    	// 세션에서 로그인한 회사 ID, 사원ID 가져오기
        int comId = getLoginComId(session);
        int empId = getLoginEmpId(session);
        // 현제 로그인 사용자가 관리자인지 여부 확인
        boolean isAdmin = hasAdminAuthority(SecurityContextHolder.getContext().getAuthentication());
        
        // DB 조회 조건을 담는 Map(myBatis mapper에 파라미터로 전달
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", comId);	//같은 회사 데이터만 조회
        paramMap.put("status", status);	// 상태 필터( null 이면 전체)
        //관리자가 아닌경우 : 자신의 예약만 조회할수있게 empId 조건추가
        if (!isAdmin) {
            paramMap.put("empId", empId);
        }
        //전체 예약 건수 조회( 페이징 계산 필요)
        int totalCount = reservationService.getReservationCount(paramMap);
        
        // pagingUtil : 전체건수, 페이지당 건수, 현재 페이지 LIMIT 시작값 계산
        // 생성자 순서 : 전체선수, 페이지당 건수, 현재 페이지
        PagingUtil paging = new PagingUtil(totalCount, PAGE_SIZE, curPage);
        
        // LIMIT 조건 추가 : startRow 와 pageSize 
        paramMap.put("startRow", paging.getPstartno());
        paramMap.put("pageSize", paging.getOnepagelist());

        //페이징 조건이 적용된 예약 목록 조회
        List<ReservationDto> reservationList = reservationService.getReservationList(paramMap);
        
        // jsp 에 전달할 데이터 세팅
        model.addAttribute("reservationList", reservationList);	// 예약 목록
        model.addAttribute("paging", paging);					// 페이징정보
        model.addAttribute("status", status);					// 현재 선택된 상태 필터
        model.addAttribute("isAdmin", isAdmin);					// 관리자 여부 (버튼 show/hide 적용)	
        model.addAttribute("loginEmpId", empId);				// 로그인 사원ID (본인예약 구분)
        model.addAttribute("error", error);						// 에러 메세지 코드 
        model.addAttribute("roleLabel", isAdmin ? "ADMIN" : "USER");	//화면에 표시할 권한 레벨

        return "resv/reservationList"; // view/resv/reservationList.jsp
    }

    /*
    * 예약 등록 폼 화면
    * - 자원목록을 조회해서 폼에 드룹다운 표시 
    * - 자원목록 페이지에서 "예약하기" 버튼클릭시 resId를 받아서 해당자원 미리 선택
    * @param resID 자원 상세페이지에서 넘어온 자원ID (없다면 null → 드롭다운에서 직접 선택)
    */
    @RequestMapping(value = "/insertForm", method = RequestMethod.GET)
    public String insertForm(@RequestParam(value = "resId", required = false) Integer resId,
                             HttpSession session,
                             Model model) {
        int comId = getLoginComId(session);
        
        // 자원 드롭다운용 조회 조건 Map 구성
        // 검색어/타입 없이 전체 자원 최대 100건 조회
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", comId);
        paramMap.put("keyword", null);	// 검색어 없음 (전체)
        paramMap.put("resType", null);	// 타입 필터 없음 (전체)
        paramMap.put("startRow", 0);	// LIMIT 시작위치
        paramMap.put("pageSize", 100);	// 최대 100건 가져오기
        
        // 자원 드롭다운 목록을 Model에 담사 jsp로 전달
        model.addAttribute("resourceList", resourceService.getResourceList(paramMap));
        
        // 자원 상세 페이지에서 "예약하기" 클릭시 해당자원 정보를 미리 세팅
        if (resId != null) {
            ResourceDto resourceDto = resourceService.getResourceDetail(comId, resId);
            model.addAttribute("resource", resourceDto);	// Jsp에서 selected 처리에 사용
        }

        return "resv/reservationInsert";
    }
    
    /*
     * 예약 등록 처리
     * - 폼에서 전송된 ResrvationDto를 DB에 저장
     * - 로그인 사용자의 comId, empId를 세선에서 가져와 DTO에 삽입 ( 화면 위조 방지)
     * - 처리 완료 후 예약 목록으로 리다이렉트 
     */
    @RequestMapping(value = "/insert", method = RequestMethod.POST)
    public String insert(ReservationDto reservationDto, HttpSession session) {
    	//폼에서 받은 DTO에 로그인 정보 주입( 클라이언트 전송값 신뢰X)
        reservationDto.setComId(getLoginComId(session));	//회사 ID세팅
        reservationDto.setEmpId(getLoginEmpId(session));	//신청자 사원ID 세팅
        reservationService.insertReservation(reservationDto);
        return "redirect:/reservation/list";	//등록후 목록으로 이동
    }
    
    /*
     * 예약 수정 폼 화면 (Get)
     * -revId로 기존 예약 데이터를 조회해서 폼에 채워넣기
     * -WAI(대기) 상태이며 본인 또는 관리자만 접근 허용
     * -조건 불총족시 목록으로 리다이렉트 + 에러 파라미터 전달
     * @param revId 수정할 예약 ID
     */
    @RequestMapping(value = "/update", method = RequestMethod.GET)
    public String updateForm(@RequestParam("id") int revId,
                             HttpSession session,
                             Model model) {
        int comId = getLoginComId(session);
        //수정 대상 예약 데이터 조회
        ReservationDto reservationDto = reservationService.getReservationDetail(comId, revId);
        // WAI 상태 & 본인 or 관리자 여부 체크
        if (!canManagePendingReservation(reservationDto, session)) {
            // 조건 불총족시 목록으로 돌아가면서 에러메시지 전달
        	return "redirect:/reservation/list?error=notAllowed";
        }
        // 자원 드롭다운 목록 조회( 등록폼과 동일한 방식)
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", comId);
        paramMap.put("keyword", null);
        paramMap.put("resType", null);
        paramMap.put("startRow", 0);
        paramMap.put("pageSize", 100);

        model.addAttribute("resourceList", resourceService.getResourceList(paramMap));
        model.addAttribute("reservation", reservationDto);	// 기존예약 데이터( 기본값 세팅용)
        return "resv/reservationUpdate";
    }

    /*
     * 예약 수정처리 (Post)
     * -DB에서 원본예약 데이터를 다시 조회해 권환 검증 (위조 방지)
     * -comId, empId는 원본 데이터 값으로 유지 ( 변경불가)
     * -처리 완료 후 예약 목록으로 리다이렉트
     */
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public String update(ReservationDto reservationDto, HttpSession session) {
        int comId = getLoginComId(session);
        // 수정 권한 검증을 위해 DB에서 원본 데이터를 다시 조회
        ReservationDto original = reservationService.getReservationDetail(comId, reservationDto.getRevId());

        //원본 기준으로 권한체크( 폼에서 status를 임의로 바꾸는 위조시도를 차단)
        if (!canManagePendingReservation(original, session)) {
            return "redirect:/reservation/list?error=notAllowed";
        }
        //  comId, empId는 원본 값 그대로 유지 ( 폼에서 받은 값 덮어쓰기)
        reservationDto.setComId(original.getComId());
        reservationDto.setEmpId(original.getEmpId());
        reservationService.updateReservation(reservationDto);
        return "redirect:/reservation/list";
    }
    
    /*
     * 예약 삭제 처리 (POST)
     * - revId로 예약 데이터를 조회해서 권한 검증 후 삭제
     * - WAI 상태 & 본인 또는 관리자만 삭제가능
     * - 처리 완료 후 예약 목록으로 리다이렉트
     * @param revId  삭제 예약 Id
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public String delete(@RequestParam("revId") int revId, HttpSession session) {
        int comId = getLoginComId(session);
        // 삭제대상 예약조회
        ReservationDto reservationDto = reservationService.getReservationDetail(comId, revId);
        // WAI 상태 & 본인 또는 관리자 여보 체크
        if (!canManagePendingReservation(reservationDto, session)) {
            return "redirect:/reservation/list?error=notAllowed";
        }

        reservationService.deleteReservation(comId, revId);
        return "redirect:/reservation/list";
    }

    /* Private 핼퍼 메서드
     * 예약 수정, 삭제 권한 체크 메서드
     * - 아래 조건 모두 만족히 true 반환
     * 1. reservationDto가 null이 아니고 유효한 예약ID를 가져야 함
     * 2. 예약 상태가 반드시 WAI(대기) 이어야 함 (APP/REJ는 수정불가)
     * 3. 관리자이거나, 예약 신청자 본인이어야 함
     * 
     * @param reservationDto 권한 체크할 예약 데이터
     * @param session 로그인세션(empId 비교)
     * @return 수정, 삭제 가능하면 true, 아니라면 fales
     * 
     */
    private boolean canManagePendingReservation(ReservationDto reservationDto, HttpSession session) {
        // 예약 데이터가 없거나 유효하지 않은 경우 차단
    	if (reservationDto == null || reservationDto.getRevId() == 0) {
            return false;
        }
    	// WAI(대기) 상태가 아닌경우 수정, 삭제 불가 ( 이미 승인/반려된 예약)
        if (!"WAI".equals(reservationDto.getStatus())) {
            return false;
        }
        // 관리자이면 본인 여부와 무관하게 허용
        if (hasAdminAuthority(SecurityContextHolder.getContext().getAuthentication())) {
            return true;
        }
        // 일반 사용자: 자 본인일 경우에만 허용
        return reservationDto.getEmpId() == getLoginEmpId(session);
    }
    
    /*
     * 세션에서 로그인 사용자의 회사ID(comId) 가져오기
     * - 세션에 값이 없거나 타입이 다르면 기본값 1 반환(개발 환경용 풀백)
     * @param session HTTP 세선
     * @return 로그인 회사ID (기본값 : 1)
     */
    private int getLoginComId(HttpSession session) {
        Object comId = session.getAttribute("loginComId");
        return comId instanceof Integer ? (Integer) comId : 1;
    }
    	
    /*
     * 세션에서 로그인 사용자의 사원ID(empId) 가져오기
     * - 세션에 값이 없거나 타입이 다르면 기본값 1 반환(개발 환경용 풀백)
     * @param session HTTP 세선
     * @return 로그인 사원ID (기본값 : 1)
     */
    private int getLoginEmpId(HttpSession session) {
        Object empId = session.getAttribute("loginEmpId");
        return empId instanceof Integer ? (Integer) empId : 1;
    }

    /*
     * Spring Security 에서 현재 로그인 사용자의 관리자 권한 여부확인
     * - ROLE_ADMIN, ADMIN, ROOT 중 하나라도 있으면 관리자로 판단
     * - Authentication 객체가 null이거나 권한 목록이 없으면 false 반환
     * @param auth Spring Security 인증 객체
     * @returen 관리자이면 true, 아니라면 false
     */
    private boolean hasAdminAuthority(Authentication auth) {
    	// 인증 정보 자체가 없는 경우(비로그인 상태)
        if (auth == null || auth.getAuthorities() == null) {
            return false;
        }
        
        // 부여된 권한 목록을 순회하며 관리자 권한 확인
        for (GrantedAuthority authority : auth.getAuthorities()) {
            // null 권한 황목은 건너뜀 (방어코드)
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
