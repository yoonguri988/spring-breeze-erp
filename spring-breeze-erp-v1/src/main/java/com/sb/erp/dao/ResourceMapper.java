package com.sb.erp.dao;

import java.util.List;
import java.util.Map;

import com.sb.erp.dto.ResSearchDto;
import com.sb.erp.dto.ResourceDto;

@Mapper
public interface ResourceMapper {

    List<ResourceDto> selectResourceList(ResSearchDto search);

    int selectResourceCount(ResSearchDto search);

    ResourceDto selectResourceDetail(int resId);

    void insertResource(ResourceDto resourceDto);

    void updateResource(ResourceDto resourceDto);

    void deleteResource(int resId);
}
