package com.sb.erp.dept.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PendingDeptResponse {
    private Integer deptId;
    private String deptName;
    private String deptCode;
    private Integer empCount;
    private String updatedAt; // dept_status가 PENDING_DELETE로 바뀐 시점 (department.updated_at 재사용)
}
