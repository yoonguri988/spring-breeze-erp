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

    <%-- 페이지 헤더 --%>
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
        <%-- 최상위 부서 등록: com_id 전달 --%>
        <a class="btn btn-primary btn-sm"
           href="${pageContext.request.contextPath}/dept/add?comId=${comId}">
            <i class="bi bi-plus-lg me-1"></i>부서 등록
        </a>
    </div>

    <%-- 조직 트리 카드 --%>
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

    <%-- ══════════════════════════════════════════════
         삭제용 숨김 폼 (POST + CSRF 토큰)
         ON DELETE CASCADE → 하위 부서도 함께 삭제됨을 안내
    ══════════════════════════════════════════════ --%>
    <form id="deleteForm" method="post"
          action="${pageContext.request.contextPath}/dept/delete">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
        <input type="hidden" name="deptId" id="deleteDeptId">
        <input type="hidden" name="comId"  value="${comId}">
    </form>
</div>

<style>
.dept-row {
    border-radius: 6px;
    padding-right: 8px;
    transition: background 0.1s;
}
.dept-row:hover { background: #f8f9fa; }
.dept-item + .dept-item { border-top: 1px solid #f0f0f0; }
</style>

<script>
/* ══════════════════════════════════════════════════
   삭제 확인 → POST form 제출
   DB: ON DELETE CASCADE — 하위 부서 전체 연쇄 삭제
══════════════════════════════════════════════════ */
function confirmDelete(deptId, deptName) {
    if (!confirm(
        '"' + deptName + '" 부서를 삭제하시겠습니까?\n\n' +
        '⚠ 하위 부서가 있으면 함께 삭제됩니다.'
    )) return;
    document.getElementById('deleteDeptId').value = deptId;
    document.getElementById('deleteForm').submit();
}

/* ══════════════════════════════════════════════════
   펼침/접힘 시 아이콘 전환 (bi-dash ↔ bi-plus)
══════════════════════════════════════════════════ */
document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(btn => {
    const target = document.querySelector(btn.dataset.bsTarget);
    if (!target) return;
    const icon = btn.querySelector('i');
    target.addEventListener('show.bs.collapse', e => {
        if (e.target.id === target.id) icon.className = 'bi bi-dash';
    });
    target.addEventListener('hide.bs.collapse', e => {
        if (e.target.id === target.id) icon.className = 'bi bi-plus';
    });
});
</script>

<%@include file="/layout/footer.jsp"%>