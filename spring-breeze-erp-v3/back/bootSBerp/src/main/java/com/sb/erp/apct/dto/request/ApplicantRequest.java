package com.sb.erp.apct.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class ApplicantRequest {
	
	@Schema(hidden=true)
	private Long apctId;
	
    @NotNull(message = "채용공고 정보는 필수입니다.")
    private Long recId;
	
    @NotBlank(message = "지원자 이름은 필수입니다.")
	private String apctName;
	
    @Email(message = "이메일 형식이 올바르지 않습니다.")
	private String apctEmail;
	
    @NotBlank(message = "전화번호는 필수입니다.")
	private String apctPhone;
	
	@Pattern(regexp = "^(RECEIVED|SCREENING|INTERVIEW|HIRED|REJECTED)$", message = "유효하지 않은 상태입니다.")
	private String apctStatus;

}
