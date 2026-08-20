package com.sb.erp.lev.entity;

import java.time.LocalDateTime;

import com.sb.erp.emp.entity.Employee;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "emp_leave_balance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpLeaveBalance {

	@Id
	@Column(name = "emp_id")
	private Long empId;
	
	// emp_id가 PK, FK인 공유키 구조
	// -> @MapsId가 emp.empId값을 그대로 이 엔티티의 @Id로 사용함
	@OneToOne
	@MapsId
	@JoinColumn(name = "emp_id")
	private Employee emp;
	
	@Column(name = "balance", nullable = false)
	@Builder.Default
	private Double balance = 0.0;
	
	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;
}
