package com.sb.erp.att.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sb.erp.att.entity.LeaveGrant;

@Repository
public interface LeaveGrantRepository extends JpaRepository<LeaveGrant, Long> {
	
	

}
