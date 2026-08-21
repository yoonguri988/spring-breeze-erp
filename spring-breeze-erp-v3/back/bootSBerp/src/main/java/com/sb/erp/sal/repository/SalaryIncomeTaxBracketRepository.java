package com.sb.erp.sal.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sb.erp.sal.entity.SalIncTaxBrkt;

@Repository
public interface SalaryIncomeTaxBracketRepository extends JpaRepository<SalIncTaxBrkt, Long> {

    /** baseSal이 속하는 구간(하한 포함, 상한 미포함) 중, payMonth 시점에 유효한 구간 1건 조회 */
    @Query("select b from SalIncTaxBrkt b " +
            "where b.minAmt <= :baseSal and (b.maxAmt is null or b.maxAmt > :baseSal) " +
            "and b.effFrom <= :payMonth and (b.effTo is null or b.effTo >= :payMonth)")
    Optional<SalIncTaxBrkt> findApplicable(@Param("baseSal") Long baseSal, @Param("payMonth") LocalDate payMonth);

    List<SalIncTaxBrkt> findAllByOrderByMinAmtAsc();
}
