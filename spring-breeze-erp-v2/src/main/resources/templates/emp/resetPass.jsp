<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp"%>
<!-- header -->
<!-- header -->

<section class="emp_resetpass sb-content">

	<!-- 페이지 헤더 -->
	<div class="sb-page-head">
		<div class="sb-page-head__txt">
			<div class="sb-breadcrumb">
				<a href="${pageContext.request.contextPath}/">홈</a>
				<i class="bi bi-chevron-right"></i>
				<a href="${pageContext.request.contextPath}/emp/list">사원관리</a>
				<i class="bi bi-chevron-right"></i> 비밀번호 초기화
			</div>
			<h1>${emp.empName} · 비밀번호 초기화</h1>
			<p>해당 사원의 비밀번호를 사번으로 초기화합니다.</p>
		</div>
		<div class="sb-page-head__actions">
			<a href="${pageContext.request.contextPath}/emp/detail?empId=${emp.empId}" class="btn btn-ghost btn-sm">
				<i class="bi bi-arrow-left"></i>
				상세 페이지로
			</a>
		</div>
	</div>

	<!-- 초기화 확인 카드 -->
	<div class="sb-card mb-3">
		<div class="sb-card__head">
			<h2>
				<i class="bi bi-key me-2 text-soft"></i>
				비밀번호 초기화 확인
			</h2>
		</div>
		<div class="sb-card__body">
			<div class="sb-confirm-box">
				<i class="bi bi-exclamation-triangle sb-confirm-box__icon"></i>
				<div class="sb-confirm-box__text">
					<p class="sb-confirm-box__title">
						<strong>${emp.posName} ${emp.empName}</strong>님의 비밀번호를 초기화합니다.
					</p>
					<p class="sb-confirm-box__desc">
						초기화 후 비밀번호는 <strong>사번(${emp.empNo})</strong>으로 설정됩니다.
						해당 사원은 다음 로그인 시 비밀번호를 변경해야 합니다.
					</p>
				</div>
			</div>

			<form action="${pageContext.request.contextPath}/emp/resetPass" method="post" class="sb-form-actions">
				<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
				<input type="hidden" name="empId" value="${emp.empId}" />

				<a href="${pageContext.request.contextPath}/emp/detail?empId=${emp.empId}" class="btn btn-ghost">취소</a>
				<button type="submit" class="btn btn-danger">
					<i class="bi bi-key"></i>
					초기화
				</button>
			</form>
		</div>
	</div>

</section>

<!--  footer -->
<!--  footer -->
<%@include file="/layout/footer.jsp"%>