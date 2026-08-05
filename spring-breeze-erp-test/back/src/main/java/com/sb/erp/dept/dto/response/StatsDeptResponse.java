package com.sb.erp.dept.dto.response;

import lombok.Getter;

@Getter
public class StatsDeptResponse {
	private long deptTotal;
	private long dept0Total;
	private long dept1Total;
	private long dept2Total;
	private long empTotal;
	
	public StatsDeptResponse(long deptTotal, long dept0Total, long dept1Total, long dept2Total, long empTotal) {
		this.deptTotal = deptTotal;
		this.dept0Total = dept0Total;
		this.dept1Total = dept1Total;
		this.dept2Total = dept2Total;
		this.empTotal = empTotal;
	}
}


