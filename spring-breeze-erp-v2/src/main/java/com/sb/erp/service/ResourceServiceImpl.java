package com.sb.erp.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.dao.ResourceMapper;
import com.sb.erp.dto.ResSearchDto;
import com.sb.erp.dto.ResourceDto;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceMapper resourceDao;

    @Override
    public List<ResourceDto> getResourceList(ResSearchDto search) {
    	search.setPstartno((search.getPstartno()-1)*search.getOnepagelist());
        List<ResourceDto> resourceList = resourceDao.selectResourceList(search);
        return resourceList;
    }

    @Override
    public int getResourceCount(ResSearchDto search) {
        int totalCount = resourceDao.selectResourceCount(search);
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
