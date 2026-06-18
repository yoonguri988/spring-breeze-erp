package com.sb.erp.util;

import java.util.Arrays;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 업로드 종류별 정책(허용 확장자 / MIME / 최대용량 / 저장 하위경로)을 정의한다.
 * 
 * 저장 경로는 servlet-context.xml 의 <mvc:resources mapping="/upload/**" location="file:///C:/file/" />
 * baseDir(C:/file/) + subDir 형태로 저장하면 바로 "/upload/{subDir}/파일명" 으로 접근 가능하다.
 *
 * 새로운 업로드 케이스(직원 프로필, 게시판 첨부, 공지 첨부, 전자결재 첨부 등)가 필요하면
 * 아래처럼 enum 상수만 추가하면 된다. (각자 기능 담당자가 추가)
 *   EMP_PROFILE(Arrays.asList("png","jpg","jpeg"), Arrays.asList("image/png","image/jpeg"), 2*1024*1024, "emp/profile"),
 *   BOARD_ATTACH(Arrays.asList("png","jpg","jpeg","pdf","zip"), Arrays.asList(...), 10*1024*1024, "board/attach"),
 */

@Getter
@AllArgsConstructor
public enum FileUploadType {
	// 회사 로고 : PNG, JPG, SVG, WEBP / 최대 2MB
    COMPANY_LOGO(
        Arrays.asList("png", "jpg", "jpeg", "svg", "webp"),
        Arrays.asList("image/png", "image/jpeg", "image/svg+xml", "image/webp"),
        2L * 1024 * 1024,
        "company/logo"
    ),
 
    // TODO: 팀원별 기능에 맞는 업로드 타입을 여기에 추가
    ;
 
    private final List<String> allowedExtensions;
    private final List<String> allowedMimeTypes;
    private final long maxSize;
    private final String subDir;
}
