package com.sb.erp.exception;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.sb.erp.util.ResponseUtil;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	
    // 개발자가 던지는 명시적 예외
    @ExceptionHandler(BizException.class)
    public Object handleBizException(BizException e, HttpServletRequest request) {
        log.warn("[BizException] {}", e.getMessage());
        if (isAjax(request)) {
            return ajaxFail(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        request.setAttribute("errorMessage", e.getMessage());
        return "error/400";
    }
    
    // 404 
    @ExceptionHandler(NoHandlerFoundException.class)
    public Object handle404(HttpServletRequest request) {
        log.warn("[404] {}", request.getRequestURI());
        if (isAjax(request)) {
            return ajaxFail("요청한 페이지를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
        }
        return "error/404"; 
    }

    // 500
    @ExceptionHandler(Exception.class)
    public Object handle500(Exception e, HttpServletRequest request) {
        log.error("[500] uri={}", request.getRequestURI(), e);
        if (isAjax(request)) {
            return ajaxFail("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return "error/500";
    }
    
    /* XMLHttpRequest 여부 판별 */
    private boolean isAjax(HttpServletRequest request) {
        return "XMLHttpRequest".equals(request.getHeader("X-Requested-With"));
    }
 
    
    /**
     * Ajax 실패 응답 반환
     * @ResponseBody + @ResponseStatus 조합을 메서드 레벨에서 쓸 수 없어
     * ResponseEntity 대신 Map + @ResponseBody 를 직접 반환
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)   // 기본값 — 실제 상태코드는 호출부에서 response에 직접 세팅 필요 시 HttpServletResponse 주입
    private Map<String, Object> ajaxFail(String message, HttpStatus status) {
        // 상태코드를 동적으로 바꾸려면 HttpServletResponse.setStatus() 사용
        // 여기서는 메시지 규격 통일이 목적이므로 Map 반환으로 충분
        return ResponseUtil.fail(message);
    }
}
