package com.sb.erp.dao;

import java.util.List;
import org.apache.ibatis.annotations.Param;

import org.apache.ibatis.annotations.Param;
import com.sb.erp.dto.EmpDto;
import com.sb.erp.dto.EmpSearchDto;

@Mapper
public interface EmpMapper {
    // 필요한 메서드 선언
    // 사원 목록 조회
    public List<EmpDto> selectAll(int comId);

    // 상세조회
    public EmpDto selectByEmpId(@Param("empId") int empId, @Param("comId") int comId);

    // 검색 필터 + 페이징(limit 추가)
    public List<EmpDto> search(EmpSearchDto dto);

    //사원 등록
    public int insert(EmpDto dto);

    //정보 수정
    public int update(EmpDto dto);
    
    //이메일 중복 유무
    public int countByEmpEmail(String empEmail);
    
    //연락처 중복 유무
    public int countByEmpMobile(String EmpMobile);
    
    /*	 paging		*/
	public int selectCnt(EmpSearchDto dto); 

    // 비밀번호 찾기시 해당하는 사원 정보가 있는지 확인
	public EmpDto selectForVerify(EmpDto dto);

	// 비밀번호 재설정
	public int updatePassByEmpId(EmpDto dto);

	// 이메일을 기준으로 사용자 정보 확인
	public EmpDto selectByEmpEmail(@Param("empEmail") String empEmail);

}