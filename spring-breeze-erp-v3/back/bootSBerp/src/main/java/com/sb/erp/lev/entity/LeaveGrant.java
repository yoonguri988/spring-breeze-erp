package com.sb.erp.lev.entity;

import java.time.LocalDateTime;

import com.sb.erp.emp.entity.Employee;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "leave_grant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveGrant {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "lev_grt_seq")
	@SequenceGenerator(name = "lev_grt_seq", sequenceName = "lev_grt_seq", allocationSize = 1)
	@Column(name = "grt_id")
	private Long grtId;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "emp_id", nullable = false)
	private Employee emp;
	
	@Column(name = "grt_days", nullable = false)
	private Double grtDays;
	
	// REG(정기부여) / CAR(이월) / ADJ(수동조정)
	@Column(name = "grt_type", nullable = false, length =20)
	private String grtType;
	
	@Column(name = "granted_at", nullable = false, insertable = false)
	private LocalDateTime grantedAt;
	
	@Column(name = "expire_at")
	private LocalDateTime expireAt;
	
	@Column(name = "reason", length = 200)
	private String reason;
}
