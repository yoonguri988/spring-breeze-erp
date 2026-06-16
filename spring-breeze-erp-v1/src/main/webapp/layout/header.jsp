<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>Spring-Breeze-ERP-V1</title>
<!-- Latest compiled and minified CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<!-- Latest compiled JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<!-- bootstrap5 icon 추가 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
<!-- 스타일 시트 추가 -->
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/app.css" />
</head>
<body>
  <div class="sb-app" data-layout="standard">
	  <aside class="sb-sidebar" id="sbSidebar">
	  <%@include file="./sidebar.jsp"%>
	  </aside>
	  <div class="sb-main">
	  <header class="sb-header" id="sbHeader">
	    <button class="sb-iconbtn" id="sbToggleSidebar" title="사이드바 접기/펼치기">
		  <i class="bi bi-list"></i>
		</button>
		
		<div class="sb-header__brand">
		  <div class="sb-brand__mark" style="width:26px;height:26px;font-size:13px;">S</div>
		  <div class="sb-brand__name" style="font-size:16px;">SB<b>erp</b></div>
		</div>
		
		<div class="sb-header__spacer"></div>
		
		<div class="sb-header__right">
		  <!-- Notifications -->
		  <div class="dropdown">
		    <button class="sb-iconbtn" data-bs-toggle="dropdown" style="width:auto;padding:0 4px;" aria-expanded="false">
		      <span class="sb-avatar" style="width:32px;height:32px;">김</span>
		    </button>
		    <ul class="dropdown-menu dropdown-menu-end" style="min-width:200px;">
		      <li class="px-3 py-2 border-bottom"><b style="font-size:13.5px;">김선빈</b><br><span class="text-faint" style="font-size:12px;">kim.sb@sberp.co.kr</span></li>
		      <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>내 프로필</a></li>
		      <li><a class="dropdown-item" href="permissions.html"><i class="bi bi-shield-lock me-2"></i>권한 설정</a></li>
		      <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>환경설정</a></li>
		      <li><hr class="dropdown-divider"></li>
		      <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-box-arrow-right me-2"></i>로그아웃</a></li>
		    </ul>
		  </div>
		</div>
	  </header>