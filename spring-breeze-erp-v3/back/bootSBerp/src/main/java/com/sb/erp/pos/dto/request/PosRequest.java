package com.sb.erp.pos.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class PosRequest {
	private long posId;
	private String posCode;
	private String posName;
	private int posOrder;
	private long comId;
}
