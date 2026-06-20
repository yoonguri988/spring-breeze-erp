<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ include file="/layout/header.jsp" %>

<main class="sb-content">
  <div class="sb-page-head">
    <div class="sb-page-head__txt">
      <div class="sb-breadcrumb">
        <a href="${pageContext.request.contextPath}/resv/list">자원 관리</a>
        <i class="bi bi-chevron-right"></i> 자원 상세
      </div>
      <h1>${resource.resName}</h1>
      <p>자원 상세 정보를 확인합니다.</p>
    </div>
    <div class="sb-page-head__actions">
      <a href="${pageContext.request.contextPath}/reservation/insertForm?resId=${resource.resId}" class="btn btn-sb btn-sm">
        <i class="bi bi-calendar2-plus"></i> 예약 신청
      </a>
    </div>
  </div>

  <c:if test="${error == 'badPassword'}">
    <div class="alert alert-danger">비밀번호가 일치하지 않아 삭제되지 않았습니다.</div>
  </c:if>
  <c:if test="${error == 'hasReservations'}">
    <div class="alert alert-danger">예약 이력이 있는 자원은 먼저 예약 내역을 정리해야 삭제할 수 있습니다.</div>
  </c:if>

  <div class="sb-card" style="max-width:760px">
    <div class="sb-card__head">
      <h2>자원 정보</h2>
      <span class="sub">${resource.resCode}</span>
    </div>
    <div class="sb-card__body">
      <div class="row g-3">
        <div class="col-md-6">
          <div class="text-faint mb-1">자원ID</div>
          <div style="font-weight:650">${resource.resId}</div>
        </div>
        <div class="col-md-6">
          <div class="text-faint mb-1">자원 유형</div>
          <div>
            <c:choose>
              <c:when test="${resource.resType == 'ROOM'}"><span class="sb-badge sb-badge--blue">회의실</span></c:when>
              <c:when test="${resource.resType == 'EQUIPMENT'}"><span class="sb-badge sb-badge--amber">장비</span></c:when>
              <c:otherwise><span class="sb-badge">${resource.resType}</span></c:otherwise>
            </c:choose>
          </div>
        </div>
        <div class="col-md-6">
          <div class="text-faint mb-1">보유 수량</div>
          <div style="font-weight:650">${resource.quantity}</div>
        </div>
        <div class="col-md-6">
          <div class="text-faint mb-1">비고</div>
          <div>${empty resource.remark ? '-' : resource.remark}</div>
        </div>
        <div class="col-md-6">
          <div class="text-faint mb-1">등록일</div>
          <div>${resource.createdAt}</div>
        </div>
        <div class="col-md-6">
          <div class="text-faint mb-1">수정일</div>
          <div>${resource.updatedAt}</div>
        </div>
      </div>

      <div class="d-flex gap-2 mt-4">
        <a href="${pageContext.request.contextPath}/resv/update?id=${resource.resId}" class="btn btn-sb">
          <i class="bi bi-pencil"></i> 수정
        </a>
        <button type="button" class="btn btn-ghost text-danger" onclick="submitDelete('${resource.resId}', 'detail')">
          <i class="bi bi-trash"></i> 삭제
        </button>
        <a href="${pageContext.request.contextPath}/resv/list" class="btn btn-ghost ms-auto">목록으로</a>
      </div>
    </div>
  </div>

  <form id="deleteForm" action="${pageContext.request.contextPath}/resv/delete" method="post" style="display:none;">
    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
    <input type="hidden" name="id" id="deleteResId">
    <input type="hidden" name="password" id="deletePassword">
    <input type="hidden" name="returnTo" id="deleteReturnTo">
  </form>
</main>

<script>
  function submitDelete(resId, returnTo) {
    var password = window.prompt('삭제 전 비밀번호를 입력하세요.');
    if (password === null) {
      return;
    }
    if (!password.trim()) {
      window.alert('비밀번호를 입력해야 삭제할 수 있습니다.');
      return;
    }
    document.getElementById('deleteResId').value = resId;
    document.getElementById('deletePassword').value = password;
    document.getElementById('deleteReturnTo').value = returnTo;
    document.getElementById('deleteForm').submit();
  }
</script>

<%@ include file="/layout/footer.jsp" %>
