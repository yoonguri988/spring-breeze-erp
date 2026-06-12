package com.sb.erp.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.DeptMapper;
import com.sb.erp.dto.DeptDto;

@Service
public class DeptServiceImpl implements DeptService {
	@Autowired DeptMapper dao;

	@Override
	public List<DeptDto> selectOrgTree(int companyId) {
		List<DeptDto> deptAllList = dao.selectAll(companyId);
		
		//deptId기준으로 Map구성
		Map<Integer, DeptDto> deptMap = deptAllList.stream()
				.collect(Collectors.toMap(DeptDto::getDeptId, dept->dept));
		
		//루트 부서를 담을 리스트
		List<DeptDto> rootList = new ArrayList<>();
		
		//트리 조립 + fullPath 셋팅
		for(DeptDto dept : deptAllList) {
			if (dept.getParentId() == 0) {
				// 루트 부서
				dept.setFullPath(dept.getDeptNm());
				rootList.add(dept);
			} else {
				// 부모를 찾아서 부모 하위 부서에 추가
				DeptDto parent = deptMap.get(dept.getParentId());
				if(parent != null) {
					dept.setFullPath(parent.getFullPath()+">"+dept.getDeptNm());
					parent.getChildren().add(dept);
				}
			}
		}
		
		return rootList; 
	}
	
	public List<DeptDto> flattenOrgTree(int companyId) {
	    List<DeptDto> rootList = selectOrgTree(companyId); // 기존 메서드 재사용
	    List<DeptDto> flatList = new ArrayList<>();
	    for (DeptDto root : rootList) {
	        flattenDFS(root, 0, flatList);
	    }
	    return flatList;
	}

	private void flattenDFS(DeptDto dept, int depth, List<DeptDto> result) {
	    dept.setDepth(depth);        // DeptDto에 depth 필드 추가 필요
	    result.add(dept);
	    for (DeptDto child : dept.getChildren()) {
	        flattenDFS(child, depth + 1, result);
	    }
	}

	@Override
	public int insert(DeptDto dto) {
		if(dto.getParentId() != 0) {
			DeptDto parent = dao.selectOneById(dto.getParentId());
			dto.setDepth(parent.getDepth()+1);
		} else {
			dto.setDepth(0);
		}
		
		//sortOrder 동일 부모 하위에서 현재 최대값
		int maxOrder = dao.maxSortOrder(dto.getParentId(), dto.getCompanyId());
		dto.setSortOrder(maxOrder);
		return dao.insert(dto);
	}

	@Override
	public int delete(int deptId) {
		if (dao.countChildren(deptId) > 0) {
	        throw new IllegalStateException("하위 부서가 존재하여 삭제할 수 없습니다.");
	    }
	    // 사원 연결 후 활성화
	    // if (employeeMapper.countByDept(deptId) > 0) {
	    //     throw new IllegalStateException("소속 사원이 존재하여 삭제할 수 없습니다.");
	    // }
		return dao.delete(deptId);
	}

	@Override
	public int update(DeptDto dto) {
	    DeptDto cur = dao.selectOneById(dto.getDeptId());

	    // parent_id가 변경된 경우 (부서 이동)
	    if (!Objects.equals(cur.getParentId(), dto.getParentId())) {
	        // 순환참조 방지: 이동 대상이 자신의 하위 부서인지 확인
	        List<Integer> childIds = dao.selectAllChildIds(cur.getDeptId());
	        if (dto.getParentId() != 0 && childIds.contains(dto.getParentId())) {
	            throw new IllegalArgumentException("하위 부서로 이동할 수 없습니다.");
	        }
	        // depth 재계산
	        if (dto.getParentId() != 0) {
	        	DeptDto newParent = dao.selectOneById(cur.getParentId());
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
	public DeptDto selectOneById(int deptId) {
		return dao.selectOneById(deptId);
	}

}
