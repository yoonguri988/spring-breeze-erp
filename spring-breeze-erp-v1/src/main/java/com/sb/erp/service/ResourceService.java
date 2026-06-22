package com.sb.erp.service;

import java.util.List;
import java.util.Map;

import com.sb.erp.dto.ResourceDto;

public interface ResourceService {
	// 자원 목록 조회 (검색 조건 + 페이징 포함)
    List<ResourceDto> getResourceList(Map<String, Object> paramMap);
    // 자원 전체 건수 조회 (페이징 계산용)
    int getResourceCount(Map<String, Object> paramMap);
    // 자원 상세 1건 조회 (회사ID + 자원ID로 특정)
    ResourceDto getResourceDetail(int comId, int resId);
    // 자원코드 중복 체크
    // excludeResId: 수정 시 자기 자신은 제외하고 중복 검사 (등록 시 null)
    int countResourceCode(int comId, String resCode, Integer excludeResId);
    // 자원 등록
    void insertResource(ResourceDto resourceDto);
    // 자원 수정
    void updateResource(ResourceDto resourceDto);
    // 자원 삭제 (회사ID + 자원ID로 특정)
    void deleteResource(int comId, int resId);
    // 특정 유형(ROOM / EQUIPMENT)의 자원 수량 조회
    // 예: 회의실이 몇 개 등록되어 있는지 확인할 때 사용
    int countResourcesByType(int comId, String resType);
}
