package com.sb.erp.global.oauth2;
/**
 * OAuth2 사용자 정보 인터페이스
 * - 공급자별 공통 속성 추출을 위한 계약
 */
public interface UserInfoOAuth2 {
    long getEmpId();   
    long getComId();   
    String getEmpEmail();     
//    String getNickname();
//    String getImage();   
}
