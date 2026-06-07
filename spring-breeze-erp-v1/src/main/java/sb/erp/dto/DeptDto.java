package sb.erp.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DeptDto {
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
	private String fullPath;        // 예시) 본사>개발부서>백엔드팀
	private List<DeptDto> children; // 하위 부서 리스트
	
	// children 초기화 (NullPointException 방지)
	public List<DeptDto> getChildren() {
		if(this.children == null) this.children = new ArrayList<>();
		return this.children;
	}
}
