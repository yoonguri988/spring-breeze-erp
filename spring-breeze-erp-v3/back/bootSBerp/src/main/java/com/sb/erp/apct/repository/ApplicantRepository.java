package com.sb.erp.apct.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sb.erp.apct.entity.Applicant;

@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, Long>{
	
	// 상태별 조회 apctStatus
	List<Applicant> findByApctStatus(String apctStatus);
	
	// 공고 삭제 전 지원자 존재 여부 체크
	boolean existsByRecruit_RecId(Long recId);
	
	// 목록 조회(특정 공고 + 상태 필터 + 페이징 , 지원한 공고명)
	@Query(
	value="""
		  SELECT * FROM (
		  SELECT a.*, ROWNUM AS rnum FROM (
	  	  SELECT apct.*, r.rec_title AS recTitle
	  	  FROM APPLICANT apct
		  JOIN RECRUIT r on apct.rec_id = r.rec_id
		  WHERE apct.com_id = :comId
	      AND (:recId IS NULL OR apct.rec_id = :recId)
		  AND (:apctStatus IS NULL OR apct.APCT_STATUS = :apctStatus)
		  ORDER BY apct.apct_id DESC
		  ) a
		  )WHERE rnum BETWEEN :start AND :end
		  """,
	nativeQuery=true)
	List<Object[]> findListWithPaging(@Param("comId")Long comId,
									  @Param("recId")Long recId,
									  @Param("apctStatus")String apctStatus,
									  @Param("start")int start,
									  @Param("end")int end);
	// 전체 개수
	@Query(
	value="""
		  SELECT COUNT(*) FROM APPLICANT apct WHERE apct.COM_ID = :comId
	      AND (:recId IS NULL OR apct.REC_ID = :recId)
		  AND (:apctStatus IS NULL OR apct.APCT_STATUS = :apctStatus)
		  """,
	nativeQuery=true)
	int countWithFilter(
			@Param("comId")Long comId,
			@Param("apctStatus")String apctStatus,
			@Param("recId")Long recId);
	
	// 상세 조회(지원한 공고명 + 이력서 수 포함)
	@Query(
	value="""
		  SELECT apct.*, r.rec_title AS recTitle,
		  (SELECT COUNT(*) FROM RESUME rs WHERE rs.apct_id = apct.apct_id) AS resumeCnt
		  FROM APPLICANT apct
		  JOIN RECRUIT r on apct.rec_id=r.rec_id
		  WHERE apct.apct_id = :apctId
		  """,
	nativeQuery=true)
	Optional<Object[]>findDetailById(@Param("apctId")Long apctId);
	
	
    // 대시보드용 - 상태별 지원자 수 집계
    @Query(
    value = """
            SELECT APCT_STATUS, COUNT(*) FROM APPLICANT
            WHERE COM_ID = :comId
            GROUP BY APCT_STATUS
            """,
    nativeQuery = true )
    List<Object[]> countByStatusGrouped(@Param("comId") Long comId);
    
    // 공고별 지원자 fit_score 순위 (적합도 높은 순)
    @Query(
        value = """
            SELECT * FROM (
              SELECT a.*, ROWNUM AS rnum FROM (
                SELECT apct.*, r.rec_title AS recTitle, rs.rsm_fit_score AS fitScore
                FROM APPLICANT apct
                JOIN RECRUIT r ON apct.rec_id = r.rec_id
                LEFT JOIN RESUME rs ON rs.apct_id = apct.apct_id
                WHERE apct.rec_id = :recId
                ORDER BY rs.rsm_fit_score DESC NULLS LAST
              ) a
            ) WHERE rnum BETWEEN :start AND :end
            """,
        nativeQuery = true
    )
    List<Object[]> findByRecIdOrderByFitScore(
        @Param("recId") Long recId,
        @Param("start") int start,
        @Param("end") int end
    );
    
    // 내 지원현황
    List<Applicant> findByProviderAndProviderId(String provider, String providerId);
    
    // 중복 지원 체크
    boolean existsByRecruit_RecIdAndProviderAndProviderId(Long recId, String provider, String providerId);
    
    // 내 지원현황 - 공고명 포함 조회
    @Query(
    value="""
          SELECT apct.*, r.rec_title AS recTitle
          FROM APPLICANT apct
          JOIN RECRUIT r ON apct.rec_id = r.rec_id
          WHERE apct.APCT_PROVIDER = :provider
          AND apct.APCT_PROVIDER_ID = :providerId
          ORDER BY apct.apct_id DESC
          """,
    nativeQuery=true)
    List<Object[]> findMyApplications(@Param("provider") String provider, @Param("providerId") String providerId);

}
