<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="../inc/header.jsp"%>
<div class="container card my-5">
	<h3 class="card-header">department form</h3>
	<div class="card-body">
		<form method="post" novalidate id="deptForm">
			<div class="mb-3">
				<label for="deptNm" class="form-label fw-medium"> 
					부서명 <span class="text-danger">*</span>
				</label>
				<input type="text" id="deptNm" name="deptNm" class="form-control"
					   placeholder="예) 개발팀" required>
				<div class="invalid-feedback">부서명은 필수 입력 항목입니다.</div>
			</div>
			<div class="mb-3">
				<label for="deptCd" class="form-label">
					부서코드 <span class="text-danger">*</span>
				</label>
				<input type="text" id="deptCd" name="deptCd" class="form-control"
				       placeholder="예) COM-DEPT" required>
				<div class="invalid-feedback">부서코드는 필수 입력 항목입니다.</div>
			</div>
		</form>
	</div>
</div>
<%@include file="../inc/footer.jsp"%>