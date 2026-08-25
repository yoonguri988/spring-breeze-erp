package com.sb.erp.emp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sb.erp.emp.entity.Employee;

@Repository
public interface EmpRepository extends JpaRepository<Employee, Long> {
	
	Optional<Employee> findByEmpNo(String empNo);
	
}