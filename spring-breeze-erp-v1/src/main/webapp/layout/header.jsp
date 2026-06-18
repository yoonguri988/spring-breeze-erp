<%@page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@taglib uri="http://www.springframework.org/security/tags"
	prefix="sec"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>Spring-Breeze-ERP-V1</title>
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/reset.css" />
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
	rel="stylesheet">
<!-- bootstrap5 icon 추가 -->
<link rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
<!-- 스타일 시트 추가 -->
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/app.css" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/emp.css" />
</head>
<body>
	<div class="sb-app" data-layout="standard">
		<aside class="sb-sidebar" id="sbSidebar">
			<%@include file="/layout/sidebar.jsp"%>
		</aside>
		<div class="sb-main">
			<header class="sb-header" id="sbHeader">
				<button class="sb-iconbtn" id="sbToggleSidebar" title="사이드바 접기/펼치기">
					<i class="bi bi-list"></i>
				</button>

				<div class="sb-header__brand">
					<div class="sb-brand__mark"
						style="width: 26px; height: 26px; font-size: 13px;">S</div>
					<div class="sb-brand__name" style="font-size: 16px;">
						SB<b>erp</b>
					</div>
				</div>

				<div class="sb-header__spacer"></div>

				<div class="sb-header__right">
					<!-- Notifications -->
					<sec:authorize access="isAuthenticated()">
						<sec:authentication property="principal.dto.empName" var="empName" />
						<div class="dropdown">
							<button class="sb-iconbtn" data-bs-toggle="dropdown"
								style="width: auto; padding: 0 4px;" aria-expanded="false">
								<span class="sb-avatar" style="width: 32px; height: 32px;"><c:out
										value="${fn:substring(empName, 0, 1)}" /></span>
							</button>
							<ul class="dropdown-menu dropdown-menu-end"
								style="min-width: 200px;">
								<li class="px-3 py-2 border-bottom"><b
									style="font-size: 13.5px;"><c:out value="${empName}" /></b><br />
									<span class="text-faint" style="font-size: 12px;"> <sec:authentication
											property="principal.dto.empEmail" />
								</span></li>
								<li><a class="dropdown-item" href="#"><i
										class="bi bi-person me-2"></i>내 프로필</a></li>
								<sec:authorize access="hasRole('ROLE_ADMID')">
									<li><a class="dropdown-item" href="permissions.html"><i
											class="bi bi-shield-lock me-2"></i>권한 설정</a></li>
								</sec:authorize>
								<li>
									<form action="${pageContext.request.contextPath}/auth/logout"
										method="post">
										<input type="hidden" name="${_csrf.parameterName}"
											value="${_csrf.token}" /> <input type="submit" value="로그아웃"
											class="dropdown-item text-danger" />
									</form>
								</li>
							</ul>
						</div>
					</sec:authorize>
				</div>
			</header>