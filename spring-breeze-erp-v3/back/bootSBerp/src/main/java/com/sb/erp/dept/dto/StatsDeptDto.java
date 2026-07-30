package com.sb.erp.dept.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

// Response
@Getter @NoArgsConstructor
public class StatsDeptDto {
	private int deptTotal;
	private int dept0Total;
	private int dept1Total;
	private int dept2Total;
	private int empTotal;
	
	public StatsDeptDto(int deptTotal, int dept0Total, int dept1Total, int dept2Total, int empTotal) {
		this.deptTotal = deptTotal;
		this.dept0Total = dept0Total;
		this.dept1Total = dept1Total;
		this.dept2Total = dept2Total;
		this.empTotal = empTotal;
	}
}
