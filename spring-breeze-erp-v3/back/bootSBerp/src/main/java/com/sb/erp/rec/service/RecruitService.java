package com.sb.erp.rec.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sb.erp.apct.repository.ApplicantRepository;
import com.sb.erp.com.entity.Company;
import com.sb.erp.emp.entity.Employee;
import com.sb.erp.rec.dto.request.RecruitRequest;
import com.sb.erp.rec.dto.response.RecruitResponse;
import com.sb.erp.rec.entity.Recruit;
import com.sb.erp.rec.repository.RecruitRepository;
import com.sb.erp.rec.repository.spec.RecruitSpecs;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecruitService {

    private final RecruitRepository recruitRepository;
    private final ApplicantRepository applicantRepository;
    private final EntityManager em;   

    // 공개용 - 특정 회사의 OPEN 공고만 목록 조회 (비회원 지원자용)
    public Page<RecruitResponse> getOpenList(Long comId, Pageable pageable) {
        return recruitRepository.findByCompany_ComIdAndRecStatus(comId, "OPEN", pageable)
                .map(this::mapToResponse);
    }

    // 관리자용 - 회사 내 공고 목록 (상태 선택 필터 + 페이징)
    public Page<RecruitResponse> getAdminList(Long comId, String recStatus, Pageable pageable) {
        return recruitRepository.findAll(RecruitSpecs.search(comId, recStatus), pageable)
                .map(this::mapToResponse);
    }

    // 상세 조회 (공개/관리자 공통)
    public RecruitResponse getDetail(Long recId) {
        Recruit recruit = recruitRepository.findById(recId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공고입니다."));
        return mapToResponse(recruit);
    }

    // 공고 등록 
    @Transactional
    public Long insert(RecruitRequest req, Long comId, Long empId) {
        Recruit entity = Recruit.builder()
                .company(em.getReference(Company.class, comId))
                .employee(em.getReference(Employee.class, empId))
                .recTitle(req.getRecTitle())
                .recDepartment(req.getRecDepartment())
                .recPosition(req.getRecPosition())
                .recHeadcount(req.getRecHeadcount())
                .recEmploymentType(req.getRecEmploymentType())
                .recDescription(req.getRecDescription())
                .recStartDate(req.getRecStartDate())
                .recEndDate(req.getRecEndDate())
                .recStatus(req.getRecStatus())
                .build();

        Recruit saved = recruitRepository.save(entity);
        return saved.getRecId();
    }
    
	// 공고 수정
    @Transactional
    public void update(Long recId, RecruitRequest req, Long comId) {
        Recruit recruit = recruitRepository.findById(recId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공고입니다."));

        if (!recruit.getCompany().getComId().equals(comId)) {
            throw new IllegalArgumentException("접근 권한이 없습니다.");
        }

        recruit.setRecTitle(req.getRecTitle());
        recruit.setRecDepartment(req.getRecDepartment());
        recruit.setRecPosition(req.getRecPosition());
        recruit.setRecHeadcount(req.getRecHeadcount());
        recruit.setRecEmploymentType(req.getRecEmploymentType());
        recruit.setRecDescription(req.getRecDescription());
        recruit.setRecStartDate(req.getRecStartDate());
        recruit.setRecEndDate(req.getRecEndDate());
        recruit.setRecStatus(req.getRecStatus());
    }
    // 공고 삭제
    @Transactional
    public void delete(Long recId, Long comId) {
        Recruit recruit = recruitRepository.findById(recId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공고입니다."));

        if (!recruit.getCompany().getComId().equals(comId)) {
            throw new IllegalArgumentException("접근 권한이 없습니다.");
        }

        if (applicantRepository.existsByRecruit_RecId(recId)) {
            throw new IllegalStateException("지원자가 있는 공고는 삭제할 수 없습니다.");
        }

        recruitRepository.delete(recruit);
    }

    private RecruitResponse mapToResponse(Recruit recruit) {
        return new RecruitResponse(
                recruit,
                recruit.getEmployee().getEmpName(),
                recruit.getApplicants().size()
        );
    }
}