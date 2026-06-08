<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="../inc/header.jsp"%>
<div class="container card my-5">
	<h3 class="card-header">department form</h3>
	<div class="card-body">
		<form method="post" novalidate id="deptForm">
			<div class="mb-3">
				<label for="deptNm" class="form-label fw-medium"> 부서명 <span
					class="text-danger">*</span>
				</label> <input type="text" id="deptNm" name="deptNm" class="form-control" value="${dto.deptNm }"
					placeholder="예) 개발팀" required>
				<div class="invalid-feedback">부서명은 필수 입력 항목입니다.</div>
			</div>
			<div class="mb-3">
				<label for="deptCd" class="form-label"> 부서코드 <span
					class="text-danger">*</span>
				</label>
				<input type="text" id="deptCd" name="deptCd" class="form-control" value="${dto.deptCd }"
					placeholder="예) COM-DEPT" required>
				<div class="invalid-feedback">부서코드는 필수 입력 항목입니다.</div>
			</div>
			<div class="mb-3">
				<label for="parentId" class="form-label">상위 부서 선택</label>
				<select id="parentId" name="parentId" class="form-select" >
					<option value="0">— 최상위 부서 (없음)</option>
					<c:forEach var="dept" items="${items}">
						<option value="${dept.deptId}"
							<c:if test="${dept.deptId == dto.parentId}">selected</c:if>>
							<%-- depth만큼 '└ ' 들여쓰기 --%>
							<c:forEach begin="1" end="${dept.depth}" var="i">&#160;&#160;&#160;</c:forEach>
							<c:if test="${dept.depth > 0}">└&#160;</c:if> ${dept.deptNm}
							<c:if test="${not empty dept.deptCd}"> (${dept.deptCd})</c:if>
						</option>
					</c:forEach>
				</select>
				<div class="select-hint">
					<i class="bi bi-info-circle"></i> 계층 구조는 들여쓰기(└)로 표시됩니다. 선택하지 않으면 최상위로 등록됩니다.
				</div>
			</div>
			<div class="mb-3 text-center">
				<button type="submit" class="btn btn-primary">수정</button>
			</div>
		</form>
	</div>
</div>
<%@include file="../inc/footer.jsp"%>