package sb.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DepartmentDto {
	private int deptId;
	private int companyId;
	private int parentId;
	private String deptNm;
	private String deptCd;
	private int depth;
	private int sortOrder;
	private int managerId;
	private String createdAt;
	private String updatedAt;
	private int isActive;
}
