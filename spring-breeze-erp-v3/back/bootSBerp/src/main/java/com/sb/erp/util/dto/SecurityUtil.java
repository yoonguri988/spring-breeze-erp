package com.sb.erp.util.dto;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.sb.erp.security.CustomUserDetails;

/**
 * 로그인 사용자 정보 조회 유틸
 * 
 * ⚠️ 비동기 스레드 주의
 * SecurityContextHolder는 ThreadLocal 기반이라 {@code @Async} 스레드에서는
 * 인증 정보가 비어 있다. 배치/메일 발송처럼 별도 스레드에서 실행되는 작업은 comId/empId를 파라미터로
 * 
 * ⚠️ 반환 타입 Long
 * 내부의 {@code (long)} 캐스팅은 CustomUserDetails가 아직 int를 반환하기 때문에 리팩토링 완료 시 제거
 */
public class SecurityUtil {

	// 현재 로그인한 유저의 comId
	// 비로그인/인증 실패 시 0L → 어떤 회사 데이터에도 매칭되지 않아 안전하게 빈 결과
	public static Long getCurrentComId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated())
			return 0L;
		Object principal = auth.getPrincipal();
		if (principal instanceof CustomUserDetails) {
			// TODO(auth 리팩토링 후): AppUser.comId가 Long이 되면 캐스팅 제거
			return (long) ((CustomUserDetails) principal).getUser().getComId();
		}
		return 0L;
	}

	// 현재 로그인한 유저의 empId
	public static Long getCurrentEmpId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated())
			return 0L;
		Object principal = auth.getPrincipal();
		if (principal instanceof CustomUserDetails) {
			// TODO(auth 리팩토링 후): AppUser.empId가 Long이 되면 캐스팅 제거
			return (long) ((CustomUserDetails) principal).getUser().getEmpId();
		}
		return 0L;
	}

	// 현재 로그인 사용자가 ROOT 또는 ROLE_ADMIN 권한을 가졌는지 확인
	public static boolean isAdminOrRoot(Authentication auth) {
	    if (auth == null || !auth.isAuthenticated()) return false;
	    return auth.getAuthorities().stream()
	        .anyMatch(a -> a.getAuthority().equals("ROOT")
	                    || a.getAuthority().equals("ROLE_ADMIN"));
	}

	public static boolean isAdmin() {
	    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	    return isAdminOrRoot(auth);
	}

	// 대상 데이터(targetComId)가 현재 로그인 유저의 회사와 같은지 검증.
	// 불일치 시 AccessDeniedException → GlobalExceptionHandler에서 403으로 매핑 예정.
	public static void checkComIdAccess(Long targetComId) {

	    Long currentComId = getCurrentComId();
	    if (targetComId == null || !targetComId.equals(currentComId)) {
	        throw new AccessDeniedException("접근 권한이 없습니다.");
	    }
	}

}
