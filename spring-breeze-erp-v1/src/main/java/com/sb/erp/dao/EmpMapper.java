package com.sb.erp.dao;

import java.util.List;
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
    
    //이메일 찾기
    public int countByEmpEmail(String empEmail);
    
    //비밀번호 수정 - 로그인 과정에서 비밀번호를 확인했으니 변경시에는 확인하지 않게 진행?
    // public int updatePass(int empId);
    
    /*	 paging		*/
	public int selectCnt(EmpSearchDto dto); 

}