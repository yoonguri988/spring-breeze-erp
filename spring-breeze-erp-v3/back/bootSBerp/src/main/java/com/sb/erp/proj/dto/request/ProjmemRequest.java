package com.sb.erp.proj.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjmemRequest {
	private Long projectProId;
	private Long empId;
	private String memberRole;

}
