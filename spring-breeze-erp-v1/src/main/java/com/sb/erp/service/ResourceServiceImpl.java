package com.sb.erp.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.ResourceMapper;
import com.sb.erp.dto.ResourceDto;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceMapper resourceDao; // MyBatis Mapper 주입

    // 자원 목록 조회 - 검색 조건(keyword, resType)과 페이징(pstartno, onepagelist)을 Map으로 전달
    @Override
    public List<ResourceDto> getResourceList(Map<String, Object> paramMap) {
        return resourceDao.selectResourceList(paramMap);
    }

    // 자원 전체 건수 조회 - 같은 검색 조건으로 총 몇 건인지 확인 (PagingUtil 계산에 사용)
    @Override
    public int getResourceCount(Map<String, Object> paramMap) {
        return resourceDao.selectResourceCount(paramMap);
    }

    // 자원 상세 조회 - comId와 resId를 Map에 담아 Mapper로 전달
    @Override
    public ResourceDto getResourceDetail(int comId, int resId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", comId);
        paramMap.put("resId", resId);
        return resourceDao.selectResourceDetail(paramMap);
    }

    // 자원코드 중복 체크
    // - 등록 시: excludeResId = null → 전체에서 중복 검사
    // - 수정 시: excludeResId = 자기 자신 resId → 자신 제외하고 중복 검사
    @Override
    public int countResourceCode(int comId, String resCode, Integer excludeResId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", comId);
        paramMap.put("resCode", resCode);
        paramMap.put("excludeResId", excludeResId); // 수정 시 자기 자신 제외용
        return resourceDao.countResourceCode(paramMap);
    }

    // 자원 등록 - ResourceDto를 그대로 Mapper에 전달
    @Override
    public void insertResource(ResourceDto resourceDto) {
        resourceDao.insertResource(resourceDto);
    }

    // 자원 수정 - ResourceDto를 그대로 Mapper에 전달
    @Override
    public void updateResource(ResourceDto resourceDto) {
        resourceDao.updateResource(resourceDto);
    }

    // 자원 삭제 - comId + resId를 Map에 담아 전달
    @Override
    public void deleteResource(int comId, int resId) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", comId);
        paramMap.put("resId", resId);
        resourceDao.deleteResource(paramMap);
    }

    // 특정 유형의 자원 수 조회
    // 예: countResourcesByType(1, "ROOM") → 회의실 몇 개 등록되어 있는지 확인
    @Override
    public int countResourcesByType(int comId, String resType) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("comId", comId);
        paramMap.put("resType", resType);
        return resourceDao.countResourcesByType(paramMap);
    }
}