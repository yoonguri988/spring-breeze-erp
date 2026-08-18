package com.sb.erp.appr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sb.erp.appr.entity.ApprFile;

@Repository
public interface ApprFileRepository extends JpaRepository<ApprFile, Long>{
	
	public List<ApprFile> findByApprDoc_DocId(Long docId);
	
	public int countByApprDoc_DocId(Long docId);
}
