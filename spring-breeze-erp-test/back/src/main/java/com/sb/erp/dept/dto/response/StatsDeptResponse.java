package com.sb.erp.dept.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StatsDeptResponse {
	private long deptTotal;
	private long dept0Total;
	private long dept1Total;
	private long dept2Total;
	private long empTotal;
}


