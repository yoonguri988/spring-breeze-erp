package com.sb.erp.com.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StatsComDto {
	private int comTotal;
	private int empTotal;
	private int industTotal;
	private String comLatest;
}
