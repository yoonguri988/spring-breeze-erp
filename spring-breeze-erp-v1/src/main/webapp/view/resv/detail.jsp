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
      <p>자원 상세 정보와 예약 가능 여부를 확인할 수 있습니다.</p>
      <span class="sb-badge ${isAdmin ? 'sb-badge--blue' : 'sb-badge--green'} mt-2 d-inline-block">${roleLabel}</span>
    </div>
    <div class="sb-page-head__actions">
      <a href="${pageContext.request.contextPath}/reservation/insertForm?resId=${resource.resId}" class="btn btn-sb btn-sm">
        <i class="bi bi-calendar2-plus"></i> 예약 요청
      </a>
    </div>
  </div>

  <c:if test="${error == 'badPassword'}">
    <div class="alert alert-danger">비밀번호가 일치하지 않아 삭제하지 못했습니다.</div>
  </c:if>
  <c:if test="${error == 'hasReservations'}">
    <div class="alert alert-danger">예약 이력이 있는 자원은 예약 내역을 먼저 정리해야 삭제할 수 있습니다.</div>
  </c:if>
  <c:if test="${error == 'adminOnly'}">
    <div class="alert alert-warning">관리자만 자원 수정과 삭제를 할 수 있습니다.</div>
  </c:if>

  <div class="sb-card" style="max-width:760px">
    <div class="sb-card__head">
      <h2>자원 정보</h2>
      <span class="sub">${resource.resCode}</span>
    </div>
    <div class="sb-card__body">
      <div class="row g-3">
        <div class="col-md-6">
          <div class="text-faint mb-1">자원 ID</div>
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
        <c:if test="${isAdmin}">
          <a href="${pageContext.request.contextPath}/resv/update?id=${resource.resId}" class="btn btn-sb">
            <i class="bi bi-pencil"></i> 수정
          </a>
          <button type="button" class="btn btn-ghost text-danger" onclick="openDeleteModal('${resource.resId}', 'detail')">
            <i class="bi bi-trash"></i> 삭제
          </button>
        </c:if>
        <a href="${pageContext.request.contextPath}/resv/list" class="btn btn-ghost ms-auto">목록으로</a>
      </div>
    </div>
  </div>
</main>

<c:if test="${isAdmin}">
  <form id="deleteForm" action="${pageContext.request.contextPath}/resv/delete" method="post" style="display:none;">
    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
    <input type="hidden" name="id" id="deleteResId">
    <input type="hidden" name="password" id="deletePassword">
    <input type="hidden" name="returnTo" id="deleteReturnTo">
  </form>

  <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">자원 삭제</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p class="mb-3">삭제 전에 현재 로그인한 계정의 비밀번호를 입력하세요.</p>
          <label for="deletePasswordInput" class="sb-form-label">비밀번호</label>
          <input type="password" id="deletePasswordInput" class="form-control" autocomplete="current-password">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost" data-bs-dismiss="modal">취소</button>
          <button type="button" class="btn btn-danger" onclick="submitDelete()">삭제</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    var deleteModalInstance;

    function openDeleteModal(resId, returnTo) {
      document.getElementById('deleteResId').value = resId;
      document.getElementById('deleteReturnTo').value = returnTo;
      document.getElementById('deletePasswordInput').value = '';

      if (!deleteModalInstance) {
        deleteModalInstance = new bootstrap.Modal(document.getElementById('deleteModal'));
      }
      deleteModalInstance.show();
    }

    function submitDelete() {
      var password = document.getElementById('deletePasswordInput').value;
      if (!password.trim()) {
        document.getElementById('deletePasswordInput').focus();
        return;
      }

      document.getElementById('deletePassword').value = password;
      document.getElementById('deleteForm').submit();
    }
  </script>
</c:if>

<%@ include file="/layout/footer.jsp" %>
