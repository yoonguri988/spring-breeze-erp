package com.sb.erp.pos.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter @Getter @Builder
public class PosRequest {
	private long posId;
	private String posCode;
	private String posName;
	private long posOrder;
	private long comId;
}