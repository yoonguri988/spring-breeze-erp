package com.sb.erp.exception;

/**
 * 비즈니스 규칙 위반 시 던지는 예외
 *
 * 사용 예시:
 *   if (employee == null) {
 *       throw new BizException("존재하지 않는 사원입니다.");
 *   }
 *   if (duplicateEmpNo) {
 *       throw new BizException("이미 사용 중인 사번입니다.");
 *   }
 *
 * GlobalExceptionHandler 가 잡아서
 *   - Ajax 요청 → { success: false, message: "..." } JSON 응답
 *   - 일반 요청 → error/400.jsp 포워드
 */

public class BizException extends RuntimeException {
	 
    public BizException(String message) {
        super(message);
    }
 
    public BizException(String message, Throwable cause) {
        super(message, cause);
    }
}