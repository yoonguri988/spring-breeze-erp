<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp"%>
<!-- header -->
<!-- header -->


	<div class="container card my-3 p-3">
		<h3 class="card-header">비밀번호 수정</h3>
		<form action="${pageContext.request.contextPath}/emp/editpass" method="post" class="card-body" onsubmit="return passCheck()">
			<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
			<input type="hidden" name="empId" value="${emp.empId}">
			<div class="p-3">
				<label for="empPass">변경할 비밀번호 : </label>
				<input type="password" id="empPass" name="empPass" />
			</div>
			<div class="text-end">
				<a href="${pageContext.request.contextPath}/emp/detail?empId=${dto.empId}" 
				class="btn btn-outline-secondary" title="수정 취소">취소</a>
				<button type="submit" class="btn btn-danger" title="비밀번호 수정">수정</button>
			</div>
		</form>
	</div>

	
<!--  footer -->
<!--  footer -->
<%@include file="/layout/footer.jsp"%>