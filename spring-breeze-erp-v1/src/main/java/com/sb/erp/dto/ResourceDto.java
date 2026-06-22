package com.sb.erp.dto;

import lombok.Data;

@Data
public class ResourceDto {

    // 자원 PK
    private int resId;

    // 자원이 속한 회사 ID
    private int comId;

    // 자원 코드
    private String resCode;

    // 자원명
    private String resName;

    // 자원 유형: ROOM / EQUIPMENT
    private String resType;

    // 등록된 자원 수량
    private int quantity;

    // 자원 설명 또는 비고
    private String remark;

    // 자원 등록일
    private String createdAt;

    // 자원 수정일
    private String updatedAt;
}