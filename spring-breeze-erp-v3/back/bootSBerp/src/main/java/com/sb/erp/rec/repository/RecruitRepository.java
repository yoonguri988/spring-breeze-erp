package com.sb.erp.rec.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sb.erp.rec.entity.Recruit;

@Repository
public interface RecruitRepository extends JpaRepository<Recruit, Long>{
	
	// 상태별 조회
	List<Recruit> findByRecStatus(String recStatus);
	
	// 목록 조회
	@Query(
	value= "SELECT * FROM ( " +
		   "SELECT r.*, ROWNUM AS rnum FROM ("+
		   "SELECT rc.*, e.EMP_NAME AS empName, "+
		   "(SELECT COUNT(*) FROM APPLICANT a WHERE a.REC_ID = rc.REC_ID) AS applicantCnt " +
		   "FROM RECRUIT rc "+
		   "JOIN EMPLOYEE e on rc.EMP_ID = e.EMP_ID " +
		   "WHERE rc.COM_ID=:comId " +
		   "ORDER BY rc.REC_ID DESC " +
		   ") r"+
		   ")WHERE rnum BETWEEN :start AND :end",
	nativeQuery=true)
	List<Object[]> findListWithPaging(@Param("comId")Long comId, @Param("start")int start, @Param("end")int end);	
	
	// 전체 개수
	@Query(
	value="SELECT COUNT(*) FROM RECRUIT WHERE COM_ID = :comId",
	nativeQuery=true)
	int countByComId(@Param("comId")Long comId);
	
	// 상세 조회(담당자명+지원자수)
	@Query(
	value= "SELECT r.*, e.EMP_NAME AS empName, "+
		   "(SELECT COUNT(*) FROM APPLICANT a WHERE a.REC_ID = r.REC_ID) AS applicantCnt " +
		   "FROM RECRUIT r " +
		   "JOIN EMPLOYEE e on r.EMP_ID = e.EMP_ID " +
		   "WHERE r.REC_ID=:recId",
	nativeQuery=true)
	Optional<Object[]>findDetailById(@Param("recId")Long recId);
	

}
