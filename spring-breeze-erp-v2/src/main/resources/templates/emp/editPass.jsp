<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp"%>
<!-- header -->
<!-- header -->

<section class="emp_editpass sb-content">

	<!-- 페이지 헤더 -->
	<div class="sb-page-head">
		<div class="sb-page-head__txt">
			<div class="sb-breadcrumb">
				<a href="${pageContext.request.contextPath}/">홈</a>
				<i class="bi bi-chevron-right"></i>
				<a href="${pageContext.request.contextPath}/emp/list">사원관리</a>
				<i class="bi bi-chevron-right"></i> 비밀번호 변경
			</div>
			<h1>비밀번호 변경</h1>
			<p>현재 비밀번호를 확인한 후 새 비밀번호로 변경합니다.</p>
		</div>
		<div class="sb-page-head__actions">
			<a href="${pageContext.request.contextPath}/emp/detail?empId=${emp.empId}" class="btn btn-ghost btn-sm">
				<i class="bi bi-arrow-left"></i>
				상세 페이지로
			</a>
		</div>
	</div>

	<!-- 에러 메시지 -->
	<c:if test="${not empty msg}">
		<div class="sb-alert sb-alert--danger mb-3">
			<i class="bi bi-exclamation-circle me-2"></i>${msg}
		</div>
	</c:if>

	<!-- 비밀번호 변경 카드 -->
	<div class="sb-card mb-3">
		<div class="sb-card__head">
			<h2>
				<i class="bi bi-key me-2 text-soft"></i>
				비밀번호 변경
			</h2>
		</div>
		<div class="sb-card__body">
			<form action="${pageContext.request.contextPath}/emp/editPass" method="post"
				onsubmit="return checkPassForm()">
				<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
				<input type="hidden" name="empId" value="${emp.empId}" />

				<div class="mb-3">
					<label for="currentPass" class="sb-form-label">현재 비밀번호 <span>*</span></label>
					<input type="password" id="currentPass" name="currentPass" class="form-control" required />
				</div>

				<div class="mb-3">
					<label for="editPass" class="sb-form-label">새 비밀번호 <span>*</span></label>
					<input type="password" id="editPass" name="editPass" class="form-control" required />
				</div>

				<div class="mb-3">
					<label for="checkPass" class="sb-form-label">새 비밀번호 확인 <span>*</span></label>
					<input type="password" id="checkPass" name="checkPass" class="form-control" required />
					<small id="passMsg" class="sb-field-msg"></small>
				</div>

				<div class="sb-form-actions">
					<a href="${pageContext.request.contextPath}/emp/detail?empId=${emp.empId}" class="btn btn-ghost">취소</a>
					<button type="submit" id="submitBtn" class="btn btn-sb">
						<i class="bi bi-check-lg"></i>
						변경
					</button>
				</div>
			</form>
		</div>
	</div>

</section>

<script>
	window.addEventListener("load", function(){
		const editPass = document.getElementById('editPass');
		const checkPass = document.getElementById('checkPass');
		const passMsg = document.getElementById('passMsg');
		
		function checkMatch() {
		    if (checkPass.value === '') { passMsg.textContent = ''; return; }
		    if (editPass.value === checkPass.value) {
		        passMsg.textContent = '비밀번호가 일치합니다.';
		        passMsg.className = 'sb-badge--green';
		    } else {
		        passMsg.textContent = '새 비밀번호가 일치하지 않습니다.';
		        passMsg.className = 'sb-badge--red';
		    }
		}
		editPass.addEventListener('input', checkMatch);
		checkPass.addEventListener('input', checkMatch);
	});
</script>

<!--  footer -->
<!--  footer -->
<%@include file="/layout/footer.jsp"%>