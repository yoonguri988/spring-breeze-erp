package com.sb.erp.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.ResourceMapper;
import com.sb.erp.dto.ResourceDto;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceMapper resourceDao;

    @Override
    public List<ResourceDto> getResourceList(Map<String, Object> paramMap) {
        List<ResourceDto> resourceList = resourceDao.selectResourceList(paramMap);
        return resourceList;
    }

    @Override
    public int getResourceCount(Map<String, Object> paramMap) {
        int totalCount = resourceDao.selectResourceCount(paramMap);
        return totalCount;
    }

    @Override
    public ResourceDto getResourceDetail(int resId) {
        ResourceDto resourceDto = resourceDao.selectResourceDetail(resId);
        return resourceDto;
    }

    @Override
    public void insertResource(ResourceDto resourceDto) {
        resourceDao.insertResource(resourceDto);
    }

    @Override
    public void updateResource(ResourceDto resourceDto) {
        resourceDao.updateResource(resourceDto);
    }

    @Override
    public void deleteResource(int resId) {
        resourceDao.deleteResource(resId);
    }
}