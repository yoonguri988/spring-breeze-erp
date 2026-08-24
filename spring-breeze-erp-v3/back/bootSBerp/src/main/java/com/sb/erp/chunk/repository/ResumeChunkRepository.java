package com.sb.erp.chunk.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sb.erp.chunk.entity.ResumeChunk;

@Repository
public interface ResumeChunkRepository extends JpaRepository<ResumeChunk, Long>{
	
	// 특정 이력서의 청크 전체 조회 (순서대로) - 재분석 시 필요
	List<ResumeChunk> findByResume_RsmIdOrderByChunkOrder(Long rsmId);
	
	// 검색 대상 청크 전체 조회 (회사 스코프) - 유사도 계산은 Java에서
	List<ResumeChunk> findByResume_Applicant_Company_ComId(Long comId);
	
}
