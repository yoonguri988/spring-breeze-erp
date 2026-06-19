<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%--
  ══════════════════════════════════════════════════════════════════
  공용 부서 트리 컴포넌트 : dept/deptTreeTab.jsp

  사용처:
    1) /dept/list.jsp                (부서관리 메뉴 - 단독 페이지)
    2) /com/edit.jsp 의 "부서관리" 탭  (회사수정 페이지에 임베드)

  필요한 변수 (컨트롤러가 모델에 담아줘야 함):
    comId      (request scope) - 현재 회사 ID
    items      (request scope) - parent_id 기준으로 트리 구조화된 DeptDto 리스트
                                  (각 dept.children 에 하위 부서 리스트 포함)

  선택 변수:
    returnUrl  (request scope) - 부서 추가/수정/삭제 완료 후 돌아올 경로.
                                  지정하지 않으면 컨트롤러 기본 동작
                                  (/dept/list?comId=... 로 복귀) 을 그대로 사용.
                                  com/edit.jsp 처럼 다른 페이지 안에 이 트리를
                                  임베드할 때는 반드시 지정해서, 부서 처리 후
                                  엉뚱한 페이지(부서관리 메뉴)로 튀지 않게 한다.
  ══════════════════════════════════════════════════════════════════
--%>
<div class="card shadow-sm">
    <div class="card-header bg-white d-flex align-items-center justify-content-between">
        <span class="fw-semibold">
            <i class="bi bi-diagram-3 me-1 text-primary"></i>부서 목록
        </span>

        <%-- 최상위 부서 등록 — comId + returnUrl 전달 --%>
        <c:url var="addRootUrl" value="/dept/add">
            <c:param name="comId" value="${comId}"/>
            <c:if test="${not empty returnUrl}">
                <c:param name="returnUrl" value="${returnUrl}"/>
            </c:if>
        </c:url>
        <a class="btn btn-primary btn-sm" href="${addRootUrl}">
            <i class="bi bi-plus-lg me-1"></i>부서 등록
        </a>
    </div>

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
     deptItem.jsp 의 confirmDelete() 가 이 폼을 공유해서 사용.
     ON DELETE CASCADE → 하위 부서도 함께 삭제됨을 안내
══════════════════════════════════════════════ --%>
<form id="deleteForm" method="post"
      action="${pageContext.request.contextPath}/dept/delete">
    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
    <input type="hidden" name="deptId" id="deleteDeptId">
    <input type="hidden" name="comId"  value="${comId}">
    <c:if test="${not empty returnUrl}">
        <input type="hidden" name="returnUrl" value="${returnUrl}">
    </c:if>
</form>

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
