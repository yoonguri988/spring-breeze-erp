package com.sb.erp.dao;

import java.util.List;
import java.util.Map;

import com.sb.erp.dao.Mapper;
import com.sb.erp.dto.ResourceDto;

@Mapper
public interface ResourceMapper {

    // ??› ëª©ë¡ ì¡°íšŒ (ê²??ƒ‰?–´ + ???…?•„?„° + ?˜?´ì§?)
    // paramMap ?‚¤: comId, keyword(??›ëª?/ì½”ë“œ ê²??ƒ‰?–´, ?—†?œ¼ë©? null), resType(?—†?œ¼ë©? null), startRow, pageSize
    List<ResourceDto> selectResourceList(Map<String, Object> paramMap);

    // ëª©ë¡ ?˜?´ì§•ì„ ?œ„?•œ ? „ì²? ê°œìˆ˜ ì¡°íšŒ (?œ„ ê²??ƒ‰ì¡°ê±´ê³? ?™?¼?•œ ?‚¤ ?‚¬?š©, startRow/pageSize?Š” ?•„?š”?—†?Œ)
    int selectResourceCount(Map<String, Object> paramMap);

    // ??› ?ƒ?„¸ ì¡°íšŒ
    ResourceDto selectResourceDetail(int resId);

    // ??› ?“±ë¡?
    void insertResource(ResourceDto resourceDto);

    // ??› ?ˆ˜? •
    void updateResource(ResourceDto resourceDto);

    // ??› ?‚­? œ
    void deleteResource(int resId);
}