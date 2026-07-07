package com.sb.erp.dto;

import lombok.Data;

@Data
public class TaskSearchDto {
    private Integer proId;
    private int pstartno;
    private int onepagelist = 10; // 한 페이지당 개수
}