<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>
<div class="sb-brand">
	<div class="sb-brand__mark">S</div>
	<div class="sb-brand__name">
		SB<b>erp</b>
	</div>
</div>

<nav class="sb-nav" id="sbNav">
	<a class="sb-nav__item" data-page="dashboard" data-tip="대시보드" href="/">
		<i class="bi bi-grid-1x2-fill"></i><span class="sb-nav__label">대시보드</span>
	</a>

  <div class="sb-nav__section">조직 관리</div>
  <a class="sb-nav__item" data-page="company" data-tip="회사 • 부서 관리" href="${pageContext.request.contextPath}/com/list">
    <i class="bi bi-building"></i><span class="sb-nav__label">회사 • 부서 관리</span>
  </a>
  <a class="sb-nav__item" data-page="employees" data-tip="사원관리" href="${pageContext.request.contextPath}/emp/list">
    <i class="bi bi-people"></i><span class="sb-nav__label">사원관리</span>
  </a>
  <a class="sb-nav__item" data-page="permissions" data-tip="권한 관리" href="${pageContext.request.contextPath}/perm/list">
    <i class="bi bi-shield-lock"></i><span class="sb-nav__label">권한 관리</span>
  </a>

  <div class="sb-nav__section">업무</div>
  <a class="sb-nav__item" data-page="documents" data-tip="전자결재" href="${pageContext.request.contextPath}/appr/list_form">
    <i class="bi bi-file-earmark-text"></i><span class="sb-nav__label">전자문서 · 결재</span>
    <span class="sb-nav__badge">5</span>
  </a>
  <a class="sb-nav__item" data-page="projects" data-tip="프로젝트" href="projects.html">
    <i class="bi bi-kanban"></i><span class="sb-nav__label">프로젝트 · 태스크</span>
  </a>
  <a class="sb-nav__item" data-page="notices" data-tip="공지" href="notices.html">
    <i class="bi bi-megaphone"></i><span class="sb-nav__label">공지 관리</span>
  </a>

	<div class="sb-nav__section">자산</div>
	<a class="sb-nav__item" data-page="resources" data-tip="자원예약"
		href="resources.html"> <i class="bi bi-calendar2-check"></i><span
		class="sb-nav__label">자원 · 예약관리</span>
	</a>
</nav>

<sec:authorize access="isAuthenticated()">
	<sec:authentication property="principal.dto.empName" var="empName" />
	<div class="sb-sidebar__foot">
		<div class="sb-userchip" data-bs-toggle="dropdown">
			<div class="sb-avatar">
				<c:out value="${fn:substring(empName, 0, 1)}" />
			</div>
			<div class="sb-userchip__meta">
				<b><c:out value="${empName}" /></b> <span><sec:authentication
						property="principal.dto.posName" /></span>
			</div>
			<i class="bi bi-chevron-expand ms-auto sb-nav__label"
				style="color: var(- -sb-ink-faint); font-size: 14px;"></i>
		</div>
	</div>
</sec:authorize>