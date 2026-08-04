package com.sb.erp.dept.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.com.dto.response.ComResponse;
import com.sb.erp.com.repository.CompanyMapper;
import com.sb.erp.dept.dto.request.DeptRequest;
import com.sb.erp.dept.dto.request.DeptSearchRequest;
import com.sb.erp.dept.dto.response.DeptResponse;
import com.sb.erp.dept.dto.response.StatsDeptResponse;
import com.sb.erp.dept.repository.DeptMapper;

@Service
public class DeptServiceImpl implements DeptService {

	@Autowired CompanyMapper comDao;
	@Autowired DeptMapper dao;
	
	@Override
	public List<DeptResponse> selectAll() {
		return dao.selectAll(1);
	}

	@Override
	public List<DeptResponse> selectOrgTree(long companyId) {
		return dao.selectAll(companyId); 
	}
	
	public List<DeptResponse> flattenOrgTree(long companyId) {
	    List<DeptResponse> rootList = selectOrgTree(companyId); // 기존 메서드 재사용
	    List<DeptResponse> flatList = new ArrayList<>();
	    for (DeptResponse root : rootList) {
	        flattenDFS(root, 0L, flatList);
	    }
	    return flatList;
	}

	private void flattenDFS(DeptResponse dept, long depth, List<DeptResponse> result) {
	    dept.setDepth(depth);        // DeptDto에 depth 필드 추가 필요
	    result.add(dept);
	    for (DeptResponse child : dept.getChildren()) {
	        flattenDFS(child, depth + 1, result);
	    }
	}

	@Override
	public int insert(DeptRequest dto) {
		if(dto.getParentId() != 0) {
			DeptResponse parent = dao.selectOneById(dto.getParentId());
			dto.setDepth(parent.getDepth()+1L);
		} else {
			dto.setDepth(0L);
		}
		
		//sortOrder 동일 부모 하위에서 현재 최대값
		long maxOrder = dao.maxSortOrder(dto.getParentId(), dto.getComId());
		dto.setSortOrder(maxOrder);
		return dao.insert(dto);
	}

	@Override
	public int delete(long deptId) {
		// 2차추가기능: 기존 삭제 버튼 클릭시 완전 삭제 -> soft delete로 변경 
		if (dao.countChildren(deptId) > 0) {
	        throw new IllegalStateException("하위 부서가 존재하여 삭제할 수 없습니다.");
	    }
		
		return dao.delete(deptId);
	}

	@Override
	public int update(DeptRequest dto) {
		DeptResponse cur = dao.selectOneById(dto.getDeptId());

	    // parent_id가 변경된 경우 (부서 이동)
	    if (!Objects.equals(cur.getParentId(), dto.getParentId())) {
	        // 순환참조 방지: 이동 대상이 자신의 하위 부서인지 확인
	        List<Long> childIds = dao.selectAllChildIds(cur.getDeptId());
	        if (dto.getParentId() != 0L && childIds.contains(dto.getParentId())) {
	            throw new IllegalArgumentException("하위 부서로 이동할 수 없습니다.");
	        }
	        // depth 재계산
	        if (dto.getParentId() != 0) {
	        	DeptResponse newParent = dao.selectOneById(dto.getParentId());
	        	if (newParent == null) {
	        	    throw new IllegalArgumentException("이동할 상위 부서가 존재하지 않습니다.");
	        	}
	        	dto.setDepth(newParent.getDepth() + 1);
	        } else {
	        	dto.setDepth(0);
	        }
	    } else {
	    	dto.setDepth(cur.getDepth());
	    }
		
		return dao.update(dto);
	}

	@Override
	public DeptResponse selectOneById(long deptId) {
		return dao.selectOneById(deptId);
	}

	@Override
	public StatsDeptResponse selecStats(long comId) {
		return dao.selectStats(comId);
	}

	@Override
	public Object getAncestorChain(long deptId) {
		List<String> chain = new ArrayList<>();
		DeptResponse dept = dao.selectOneById(deptId);
	    chain.add(0, dept.getDeptName());
	    while (dept.getParentId() != 0) {
	        dept = dao.selectOneById(dept.getParentId());
	        chain.add(0, dept.getDeptName());
	    }
	    // 맨 앞에 회사명 추가
	    ComResponse com = comDao.selectOneById(dept.getComId());
	    chain.add(0, com.getComName());
	    return chain;
	}

	@Override
	public long countEmployees(long deptId) {
		return dao.countByDept(deptId);
	}

	@Override
	public int softDelete(long deptId) {
		return dao.softDelete(deptId);
	}

	@Override
	public List<DeptResponse> getAllDeptsByComId(long comId) {
		return dao.selectAllDeptsByComId(comId);
	}

	@Override
	public DeptResponse isDuplicateDeptCode(DeptSearchRequest search) {
		return dao.selectDeptCode(search);
	}

	// KJY 조직도 범위 제한
	@Override
	public List<DeptResponse> selectAncestorDepts(long deptId) {
		List<DeptResponse> chain = new ArrayList<>();
		DeptResponse dept = dao.selectOneById(deptId);
		chain.add(0, dept);
		while(dept.getParentId() != 0) {
			dept = dao.selectOneById(dept.getParentId());
			chain.add(0, dept);
		}
		return chain;
	}

}
