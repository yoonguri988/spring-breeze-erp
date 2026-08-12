package com.sb.erp.res.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sb.erp.res.dto.request.ResRequest;
import com.sb.erp.res.dto.request.ResSearchRequest;
import com.sb.erp.res.dto.response.ResResponse;
import com.sb.erp.res.repository.ResourceMapper;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired private ResourceMapper dao;

    @Override
    public List<ResResponse> getResourceList(ResSearchRequest search) {
    	search.setPstartno((search.getPstartno()-1)*search.getOnepagelist());
        List<ResResponse> resourceList = dao.selectResourceList(search);
        return resourceList;
    }

    @Override
    public int getResourceCount(ResSearchRequest search) {
        return dao.selectResourceCount(search);
    }

    @Override
    public ResResponse getResourceDetail(long resId) {
        return dao.selectResourceDetail(resId);
    }

    @Override
    public int insertResource(ResRequest ResResponse) {
    	return dao.insertResource(ResResponse);
    }

    @Override
    public int updateResource(ResRequest ResResponse) {
    	return dao.updateResource(ResResponse);
    }

    @Override
    public int deleteResource(long resId) {
    	return dao.deleteResource(resId);
    }

	@Override
	public ResResponse isDuplicateResCode(ResRequest ResResponse) {
		return dao.selectByResCode(ResResponse);
	}

	@Override
	public List<ResResponse> getResListForResv(ResSearchRequest search) {
		return dao.selectResListForResv(search);
	}
}
