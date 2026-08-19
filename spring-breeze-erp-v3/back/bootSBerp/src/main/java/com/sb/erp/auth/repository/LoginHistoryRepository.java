package com.sb.erp.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.sb.erp.auth.entity.LoginHistory;

public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long>, JpaSpecificationExecutor<LoginHistory> {
}
