package com.sb.erp.resv.dto.reponse;

import lombok.Getter;

@Getter
public class StatsResvResponse {
	private int resvTotal;
	private int waiTotal;
	private int appTotal;
	private int rejTotal;
	
	public StatsResvResponse(int resvTotal, int waiTotal, int appTotal, int rejTotal) {
		super();
		this.resvTotal = resvTotal;
		this.waiTotal = waiTotal;
		this.appTotal = appTotal;
		this.rejTotal = rejTotal;
	}
}
