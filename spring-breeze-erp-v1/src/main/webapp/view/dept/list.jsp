<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@include file="/layout/header.jsp"%>

<%-- Toast 알림 (msg 파라미터) --%>
<c:if test="${not empty msg}">
<div class="position-fixed bottom-0 end-0 p-3" style="z-index:1100">
    <div id="liveToast" class="toast align-items-center text-bg-success border-0 show" role="alert">
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-check-circle me-1"></i>${msg}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto"
                    data-bs-dismiss="toast"></button>
        </div>
    </div>
</div>
</c:if>

<main class="sb-content">

    <!-- 페이지 헤더 -->
    <div class="sb-page-head">
        <div class="sb-page-head__txt">
            <div class="sb-breadcrumb">
                <a href="${pageContext.request.contextPath}/">홈</a>
                <i class="bi bi-chevron-right"></i>
                회사/부서 관리
                <i class="bi bi-chevron-right"></i>
                부서 관리
            </div>
            <h1>${com.comName} 부서 관리</h1>
            <p>부서 구조를 조회하고 관리합니다.</p>
        </div>
        <%-- 부서 등록 버튼은 deptTreeTab.jsp 카드 헤더(툴바)에 있음 --%>
    </div>

    <!-- 통계 타일 -->
    <div class="row g-3 mb-4">
        <div class="col-sm-6 col-lg-3">
            <div class="sb-stat">
                <div class="sb-stat__top">
                    <div class="sb-stat__ico tone-blue"><i class="bi bi-diagram-3"></i></div>
                    <div class="sb-stat__label">전체 부서</div>
                </div>
                <div class="sb-stat__val">${empty com.comId ? '—' : stats.deptTotal}</div>
            </div>
        </div>
        <div class="col-sm-6 col-lg-3">
            <div class="sb-stat">
                <div class="sb-stat__top">
                    <div class="sb-stat__ico tone-violet"><i class="bi bi-building-fill"></i></div>
                    <div class="sb-stat__label">본부</div><!-- (depth 1) -->
                </div>
                <div class="sb-stat__val">${empty com.comId ? '—' : stats.dept0Total}</div>
            </div>
        </div>
        <div class="col-sm-6 col-lg-3">
            <div class="sb-stat">
                <div class="sb-stat__top">
                    <div class="sb-stat__ico tone-green"><i class="bi bi-people"></i></div>
                    <div class="sb-stat__label">팀</div><!-- (depth 2+) -->
                </div>
                <div class="sb-stat__val">${empty com.comId ? '—' : stats.dept1Total}</div>
            </div>
        </div>
        <div class="col-sm-6 col-lg-3">
            <div class="sb-stat">
                <div class="sb-stat__top">
                    <div class="sb-stat__ico tone-amber"><i class="bi bi-person-fill"></i></div>
                    <div class="sb-stat__label">전체 인원</div>
                </div>
                <div class="sb-stat__val">${empty com.comId ? '—' : stats.empTotal}</div>
            </div>
        </div>
    </div>
    <jsp:include page="deptTreeTab.jsp"/>
</main>
<%@include file="/layout/footer.jsp"%>
