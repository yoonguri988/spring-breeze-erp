package com.sb.erp.dto;

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
	private int comId;
	private int parentId;
	private String deptName;
	private String deptCode;
	private int depth;
	private int sortOrder;
	private int empId;
	private String createdAt;
	private String updatedAt;
	private String fullPath;
	private List<DeptDto> children; 

	public List<DeptDto> getChildren() {
		if(this.children == null) this.children = new ArrayList<>();
		return this.children;
	}
}
