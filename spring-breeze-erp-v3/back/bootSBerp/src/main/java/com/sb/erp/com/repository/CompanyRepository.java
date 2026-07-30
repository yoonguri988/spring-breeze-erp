package com.sb.erp.com.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sb.erp.com.entity.Company;

@Repository                                             //Entity, PK의 자료형
public interface CompanyRepository  extends JpaRepository<Company, Long> {
	Optional<Company> findByBizNo(String bizno);
}

//create - save: insert into app_user (컬럼,,,) values (?,,,)
//read   - findAll  : select * from app_user
//       findById : select * from app_user where id=?
//update - save : update app_user set 컬럼=?,,, where id=?
//delete - deleteById : delete app_user where id=?