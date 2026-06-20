package com.sb.erp.service;

import java.util.List;
import java.util.Map;

import com.sb.erp.dto.ResourceDto;

public interface ResourceService {

    List<ResourceDto> getResourceList(Map<String, Object> paramMap);

    int getResourceCount(Map<String, Object> paramMap);

    ResourceDto getResourceDetail(int resId);

    void insertResource(ResourceDto resourceDto);

    void updateResource(ResourceDto resourceDto);

    int countReservationsByResourceId(int resId);

    void deleteResource(int resId);
}
