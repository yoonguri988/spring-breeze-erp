package com.sb.erp.emp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sb.erp.emp.entity.Employee;

@Repository
public interface EmpRepository extends JpaRepository<Employee, Long> {
}