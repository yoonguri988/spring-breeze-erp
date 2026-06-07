package sb.erp.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import sb.erp.dao.DeptMapper;
import sb.erp.dto.DeptDto;

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

}
