package com.sb.erp.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.sb.erp.dao.EmpMapper;
import com.sb.erp.dto.EmpAuthDto;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.EmpSearchDto;
import com.sb.erp.util.SecurityUtil;
import com.sb.erp.service.EmailService;

@Service
public class EmpServiceImpl implements EmpService {
	@Autowired EmpMapper dao;
	@Autowired PasswordEncoder passEncoder;
	@Autowired EmailService emailService;

	// ─── 조회 ────────────────────────────
	// empId로 사원 정보 찾기
	@Override
	public EmpDto selectByEmpId(int empId) {
		return dao.selectByEmpId(empId, SecurityUtil.getCurrentComId());
	}

	// 이메일로 조회
	@Override
	public EmpDto selectByEmpEmail(String empEmail) {
		return dao.selectByEmpEmail(empEmail);
	}

	// 사원 정보 검색
	@Override
	public List<EmpDto> search(EmpSearchDto dto) {
		dto.setComId(SecurityUtil.getCurrentComId());
		return dao.search(dto);
	}

	// 페이징
	@Override
	public int selectCnt(EmpSearchDto dto) {
		dto.setComId(SecurityUtil.getCurrentComId());
		return dao.selectCnt(dto);
	}

	// 해당 부서 id를 통해 사원정보 조회
	@Override
	public List<EmpDto> selectByDeptId(int deptId) {
		return dao.selectByDeptId(deptId);
	}

	// ─── 등록 / 수정 ─────────────────────
	// 사원 정보 등록
	@Override
	@Transactional // 없으면 추가 (afterCommit 훅 발동 조건)
	public int insert(EmpDto dto) {
		int result = -1;
		dto.setComId(SecurityUtil.getCurrentComId());
		dto.setEmpPass(passEncoder.encode(dto.getEmpNo()));

		if (dto.getEmpStatus() == null || dto.getEmpStatus().isEmpty()) {
			dto.setEmpStatus("재직");
		}

		result = dao.insert(dto);

		if (result > 0) {
			// ⭐ 트랜잭션 커밋 후에만 비동기 메일 발송 예약
			// - 롤백되면 실행 안 됨 → 존재하지 않는 사원에게 메일 나갈 위험 없음
			// - @Async 스레드로 위임 → 응답 지연 없음
			final EmpDto empSnapshot = dto;
			TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
				@Override
				public void afterCommit() {
					try {
						emailService.sendWelcomeMailAsync(empSnapshot);
					} catch (Exception e) {
						// 커밋 이후이므로 등록 자체는 이미 확정됨. 로그만.
						// 만약 이 예외로 메일이 못 나가도 다음날 01:30 스케줄러가 복구.
						System.err.println("[EmpService] 환영 메일 예약 실패: " + e.getMessage());
					}
				}
			});
		}
		return result;
	}

	@Override
	public int update(EmpDto dto) {
		dto.setComId(SecurityUtil.getCurrentComId());
		return dao.update(dto);
	}

	// ─── 중복 검사 ───────────────────────
	@Override
	public boolean isEmailDuplicate(String empEmail) {
		return dao.countByEmpEmail(empEmail) > 0;
	}

	@Override
	public boolean isMobileDuplicate(String empMobile) {
		return dao.countByEmpMobile(empMobile) > 0;
	}

	@Override
	public boolean isEmpNoDuplicate(String empNo) {
		return dao.countByEmpNo(empNo, SecurityUtil.getCurrentComId()) > 0;
	}

	// ─── 비밀번호 ────────────────────────

	@Override
	public int updatePassByEmpId(EmpDto dto) {
		dto.setComId(SecurityUtil.getCurrentComId());
		return dao.updatePassByEmpId(dto);
	}

	// 관리자 초기화 - 사번으로 리셋
	@Override
	public int resetPassByEmpNo(int empId) {
		EmpDto emp = dao.selectByEmpId(empId, SecurityUtil.getCurrentComId());
		if (emp == null)
			return 0;

		EmpDto dto = new EmpDto();
		dto.setEmpId(empId);
		dto.setComId(SecurityUtil.getCurrentComId());
		dto.setEmpPass(passEncoder.encode(emp.getEmpNo()));
		return dao.updatePassByEmpId(dto);
	}

	// 본인 비밀번호 변경 - 현재 비번 검증 후 변경
	// 반환값: -1(사원 없음), 0(불일치), 1(성공)
	@Override
	public int changePassword(int empId, String currentPass, String newPass) {
		String savedHash = dao.selectPassById(empId);
		if (savedHash == null)
			return -1;
		if (!passEncoder.matches(currentPass, savedHash))
			return 0;

		EmpDto dto = new EmpDto();
		dto.setEmpId(empId);
		dto.setComId(SecurityUtil.getCurrentComId());
		dto.setEmpPass(passEncoder.encode(newPass));
		return dao.updatePassByEmpId(dto);
	}

	// 기존 비밀번호와 일치 확인
	@Override
	public boolean matchPassword(EmpDto dto) {
		String existsPass = dao.selectPassById(dto.getEmpId());
		return passEncoder.matches(dto.getEmpPass(), existsPass);
	}

	// 비밀번호 찾기시 해당하는 사원 정보가 있는지 확인
	@Override
	public EmpDto selectForVerify(EmpDto dto) {
		return dao.selectForVerify(dto);
	}

	// ─── 권한 표시용 ─────────────────────
	// 회사 아이디를 기준으로 권한 정보와 엮여있는 사원 정보 확인
	@Override
	public List<EmpAuthDto> selectAuthByComId() {
		return dao.selectAuthByComId(SecurityUtil.getCurrentComId());
	}

	// 비밀번호 분실 - session(empId) 기반, 본인확인 후에만 진입 가능
	@Override
	public Object selectAuthByEmpId(int empId) {
		return dao.selectAuthByEmpId(empId);
	}
	
	// 비밀번호 분실시 본인 확인 - EMP_ID로만 조회해서 업데이트
	@Override
	public int updatePassByEmpIdOnly(EmpDto dto) {
		return dao.updatePassByEmpIdOnly(dto);
	}

}