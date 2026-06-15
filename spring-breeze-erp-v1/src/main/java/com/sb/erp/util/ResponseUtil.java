package com.sb.erp.util;

import java.util.HashMap;
import java.util.Map;

import lombok.NoArgsConstructor;

/**
 * Ajax 요청에 대한 JSON 응답 형식을 통일하는 유틸 클래스
 *
 * 응답 구조:
 * {
 *   "success": true/false,
 *   "message": "처리 결과 메시지",
 *   "data": { ... }   // 선택적
 * }
 *
 * 사용 예시 (Controller):
 *   @ResponseBody
 *   public Map<String, Object> save(...) {
 *       employeeService.save(dto);
 *       return ResponseUtil.ok("사원이 등록되었습니다.");
 *   }
 */

@NoArgsConstructor
public class ResponseUtil {
    /* 데이터 없이 성공 메시지만 반환 */
    public static Map<String, Object> ok(String message) {
        return build(true, message, null);
    }
 
    /* 성공 + 단일 데이터 반환 */
    public static Map<String, Object> ok(String message, Object data) {
        return build(true, message, data);
    }
 
    /* 메시지 없이 데이터만 반환 (목록 조회 등) */
    public static Map<String, Object> ok(Object data) {
        return build(true, null, data);
    }
 
    /* 실패 메시지만 반환 */
    public static Map<String, Object> fail(String message) {
        return build(false, message, null);
    }
 
    /* 실패 메시지 + 추가 데이터 반환 (검증 오류 목록 등) */
    public static Map<String, Object> fail(String message, Object data) {
        return build(false, message, data);
    }
 
    private static Map<String, Object> build(boolean success, String message, Object data) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        if (message != null) {
            result.put("message", message);
        }
        if (data != null) {
            result.put("data", data);
        }
        return result;
    }
}
