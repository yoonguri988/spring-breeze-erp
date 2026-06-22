package com.sb.erp.dao;

import java.util.List;
import java.util.Map;

import com.sb.erp.dto.ResourceDto;

@Mapper
public interface ResourceMapper {
    List<ResourceDto> selectResourceList(Map<String, Object> paramMap);
    int selectResourceCount(Map<String, Object> paramMap);
    ResourceDto selectResourceDetail(Map<String, Object> paramMap);
    int countResourceCode(Map<String, Object> paramMap);
    void insertResource(ResourceDto resourceDto);
    void updateResource(ResourceDto resourceDto);
    void deleteResource(Map<String, Object> paramMap);
    int countResourcesByType(Map<String, Object> paramMap);
}
