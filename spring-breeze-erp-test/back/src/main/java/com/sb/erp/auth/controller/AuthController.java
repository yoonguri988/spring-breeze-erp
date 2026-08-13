package com.sb.erp.auth.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.auth.dto.request.ConfirmRequest;
import com.sb.erp.auth.dto.request.LoginRequest;
import com.sb.erp.auth.dto.request.UpdatePassRequest;
import com.sb.erp.auth.dto.response.AuthResponse;
import com.sb.erp.auth.dto.response.AuthUserResponse;
import com.sb.erp.auth.service.AuthService;
import com.sb.erp.com.service.CompanyService;
import com.sb.erp.emp.dto.request.EmpRequest;
import com.sb.erp.emp.dto.response.EmpResponse;
import com.sb.erp.emp.service.EmpService;
import com.sb.erp.global.oauth2.CustomUserPrincipal;
import com.sb.erp.global.security.JwtProperties;
import com.sb.erp.global.security.JwtProvider;
import com.sb.erp.global.security.TokenStore;

import io.jsonwebtoken.Claims;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Tag(name="Auth REST API", description = "회원인증 및 관리 관련 API")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

	private final JwtProperties props;      // JWT 출입증 (설정값)      
	private final JwtProvider jwtProvider;  // JWT 토근생성/검증 ( access Token / refresh Token )
	private final TokenStore tokenStore;	// JMT 저장소
	private final PasswordEncoder passEncoder;
	
	@Autowired AuthService service;
	@Autowired EmpService empService;
	@Autowired CompanyService comService;

	@Operation(summary = "로그인", description = "Access Token 발급 + Refresh Token은 HttpOnly 쿠키로 저장")
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest dto,
	            HttpServletRequest request,
	            HttpServletResponse response) {
	AuthUserResponse user = service.readAuth(dto.getEmpEmail());
	
	// emp_pass는 readAuth 쿼리에 emp_pass 컬럼 추가 후에만 채워짐 (auth-mapper.xml 참고)
	if (user == null || user.getEmpPass() == null
	|| !passEncoder.matches(dto.getEmpPass(), user.getEmpPass())) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
		.body(Map.of("error", "이메일 또는 비밀번호가 올바르지 않습니다."));
	}
	
	String access = jwtProvider.createAccessToken(
	String.valueOf(user.getEmpId()),
	Map.of("comId", user.getComId(),
			"empNo", user.getEmpNo(),
			"empName", user.getEmpName(),
			"posName", user.getPosName(),
			"comName", user.getComName(),
			"empEmail", user.getEmpEmail(),
			"roles", user.getAuthList().stream().map(AuthResponse::getAutName).toList())
	);
	
	String refresh = jwtProvider.createRefreshToken(String.valueOf(user.getEmpId()));
	tokenStore.saveRefreshToken(
			String.valueOf(user.getEmpId()), refresh,
			(long) props.getRefreshTokenExpSeconds()
	);
	
	 response.addHeader(HttpHeaders.SET_COOKIE,
             buildRefreshCookie(refresh, props.getRefreshTokenExpSeconds()).toString());
	 
	return ResponseEntity.ok(Map.of(
			"accessToken", access,
			"empId", user.getEmpId(),
			"comId", user.getComId()
		));
	}
	
	@Operation(summary = "로그아웃", description = "Redis에서 refreshToken 삭제 + 쿠키 만료")
	@PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(Authentication authentication,
                                                        HttpServletResponse response) {
        if (authentication != null) {
            CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
            tokenStore.deleteRefreshToken(String.valueOf(principal.getEmpId()));
        }
        response.addHeader(HttpHeaders.SET_COOKIE, buildRefreshCookie("", 0).toString()); // 즉시 만료
        return ResponseEntity.ok(Map.of("state", "OK"));
    }
	
	
    @Operation(summary = "Access Token 재발급")
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refresh(@CookieValue("refreshToken") String refreshToken) {
        var claims = jwtProvider.parse(refreshToken).getBody();
        String empId = claims.getSubject();

        String stored = tokenStore.getRefreshToken(empId);
        if (stored == null || !stored.equals(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid refresh token"));
        }

        List<String> roles = service.findAuthByUserId(Long.valueOf(empId));
        String newAccessToken = jwtProvider.createAccessToken(empId, Map.of("roles", roles));

        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }
	
	
    // 비밀번호를 변경하려는 사용자가 실제로 존재하는지 확인
    // 세션 대신 짧은 유효기간의 resetToken(JWT)을 발급해서 클라이언트가 들고 있게 함
    @Operation(summary = "비밀번호 재설정 - 본인확인", description = "본인 확인 성공 시 10분짜리 resetToken 발급")
    @PostMapping("/confirm")
    public ResponseEntity<Map<String, Object>> confirm(@RequestBody ConfirmRequest request) {
    	
    	EmpRequest dto = new EmpRequest();
    	dto.setEmpNo(request.getEmpNo());
    	dto.setEmpEmail(request.getEmpEmail());
    	dto.setEmpMobile(request.getEmpMobile());
    	
        EmpResponse emp = empService.selectForVerify(dto);
        if (emp == null) {
            return ResponseEntity.ok(Map.of("state", "FAIL"));
        }
        String resetToken = jwtProvider.createResetToken(String.valueOf(emp.getEmpId()));
        return ResponseEntity.ok(Map.of("state", "OK", "resetToken", resetToken));
    }
    
    // 비밀번호 재설정 (비로그인, resetToken 기반)
    @Operation(summary = "비밀번호 재설정", description = "confirm에서 발급받은 resetToken으로 본인 확인 후 비밀번호 변경")
    @PostMapping("/updatePass")
    public ResponseEntity<Map<String, String>> updatePass(@RequestBody UpdatePassRequest dto) {
        Claims claims;
        try {
            claims = jwtProvider.parse(dto.getResetToken()).getBody();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "유효하지 않거나 만료된 요청입니다. 본인확인을 다시 진행해주세요."));
        }
 
        if (!"reset".equals(claims.get("purpose", String.class))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "잘못된 토큰입니다."));
        }
 
        Long empId = Long.valueOf(claims.getSubject());
 
        EmpRequest patch = new EmpRequest();
        patch.setEmpId(empId);
        patch.setEmpPass(passEncoder.encode(dto.getNewPass()));
        empService.updatePassByEmpIdOnly(patch);
 
        return ResponseEntity.ok(Map.of("state", "OK"));
    }
    
    // 비밀번호 변경 (로그인 상태, JWT 인증 사용자 본인)
    @Operation(summary = "비밀번호 변경(로그인 상태)")
    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(Authentication authentication,
                                                                @RequestBody UpdatePassRequest dto) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
 
        EmpRequest patch = new EmpRequest();
        patch.setEmpId(principal.getEmpId());
        patch.setEmpPass(passEncoder.encode(dto.getNewPass()));
        empService.updatePassByEmpIdOnly(patch);
 
        return ResponseEntity.ok(Map.of("state", "OK"));
    }
	
    // 공통 
    // secure(true) + sameSite("Strict") -> https:// 로 접속해야 브라우저가 쿠키 저장
    private ResponseCookie buildRefreshCookie(String value, int maxAgeSeconds) {
        return ResponseCookie.from("refreshToken", value)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(maxAgeSeconds)
                .build();
    }
}
