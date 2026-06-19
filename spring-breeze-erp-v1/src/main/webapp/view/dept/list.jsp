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

<div class="container my-5" style="max-width:860px;">

    <%-- 페이지 헤더
         ※ "부서 등록" 버튼은 공용 컴포넌트(deptTreeTab.jsp)의 카드 헤더로 이동했음 --%>
    <div class="d-flex align-items-center justify-content-between mb-4">
        <%-- 회사 목록으로 복귀 (com_id 파라미터로 전달) --%>
        <a href="${pageContext.request.contextPath}/com/list"
           class="btn btn-sm btn-outline-secondary">
            <i class="bi bi-chevron-left"></i>
        </a>
        <h5 class="mb-0 fw-semibold">
            <i class="bi bi-diagram-3 me-1 text-primary"></i>
            조직도
            <c:if test="${not empty comName}">
                <small class="text-muted fw-normal fs-6 ms-1">— ${comName}</small>
            </c:if>
        </h5>
        <%-- 좌측 뒤로가기 버튼과 너비를 맞추기 위한 빈 자리 --%>
        <span style="width:38px;"></span>
    </div>

    <%-- 부서 트리 (공용 컴포넌트) — 여기서는 returnUrl 을 지정하지 않으므로,
         추가/수정/삭제 완료 후 컨트롤러 기본 동작(/dept/list?comId=...)으로 복귀 --%>
    <jsp:include page="deptTreeTab.jsp"/>
</div>

<%@include file="/layout/footer.jsp"%>
