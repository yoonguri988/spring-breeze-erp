<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@include file="../inc/header.jsp"%>
<div class="container my-5" style="max-width:860px;">
    <%-- 페이지 헤더 --%>
    <div class="d-flex align-items-center justify-content-between mb-4">
    	<a href="${pageContext.request.contextPath}/com/list.do?comId=${dto.comId}"
           class="btn btn-sm btn-outline-secondary">
            <i class="bi bi-chevron-left"></i>
        </a>
        <h5 class="mb-0 fw-semibold">
            <i class="bi bi-diagram-3 me-1 text-primary"></i> 조직도
        </h5>
        <a class="btn btn-primary btn-sm"
           href="${pageContext.request.contextPath}/dept/add.do?comId=${comId}">
            <i class="bi bi-plus-lg me-1"></i> 부서 등록
        </a>
    </div>

    <div class="card shadow-sm">
        <div class="card-body p-3">
            <c:choose>
                <c:when test="${empty items}">
                    <div class="text-center py-5 text-muted">
                        <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                        등록된 부서가 없습니다.
                    </div>
                </c:when>
                <c:otherwise>
                    <ul class="list-unstyled mb-0">
                        <c:forEach var="dept" items="${items}">
                            <c:set var="dept" value="${dept}" scope="request"/>
                            <jsp:include page="deptItem.jsp"/>
                        </c:forEach>
                    </ul>
                </c:otherwise>
            </c:choose>
        </div>
    </div>
</div>

<style>
.dept-row {
    border-radius: 6px;
    padding-right: 8px;
    transition: background 0.1s;
}
.dept-row:hover {
    background: #f8f9fa;
}
.dept-item + .dept-item {
    border-top: 1px solid #f0f0f0;
}
</style>

<script>
window.addEventListener('load', function(){
	const msg = "${msg}";
	if(msg != null && msg != '') alert(msg);
})

// 펼침/접힘 시 아이콘 전환 (bi-dash ↔ bi-plus)
document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(btn => {
    const target = document.querySelector(btn.dataset.bsTarget);
    if (!target) return;

    const icon = btn.querySelector("i");

    target.addEventListener("show.bs.collapse", e => {
        if (e.target.id === target.id) icon.className = "bi bi-dash";
    });
    target.addEventListener("hide.bs.collapse", e => {
        if (e.target.id === target.id) icon.className = "bi bi-plus";
    });
});
</script>

<%@include file="../inc/footer.jsp"%>
