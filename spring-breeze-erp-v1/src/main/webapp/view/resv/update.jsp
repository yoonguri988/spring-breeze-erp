<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/layout/header.jsp" %>

<main class="sb-content">
  <div class="sb-page-head">
    <div class="sb-page-head__txt">
      <div class="sb-breadcrumb">
        <a href="${pageContext.request.contextPath}/resv/list">자원 관리</a>
        <i class="bi bi-chevron-right"></i> 자원 수정
      </div>
      <h1>자원 수정</h1>
      <p>등록된 자원 정보를 수정합니다.</p>
    </div>
  </div>

  <div class="sb-card" style="max-width:720px">
    <div class="sb-card__head">
      <h2>기본 정보</h2>
      <span class="sub">${resource.resCode}</span>
    </div>
    <div class="sb-card__body">
      <form action="${pageContext.request.contextPath}/resv/update" method="post">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
        <input type="hidden" name="resId" value="${resource.resId}"/>

        <div class="mb-3">
          <label class="sb-form-label">자원ID</label>
          <input type="text" class="form-control" value="${resource.resId}" readonly>
        </div>

        <div class="mb-3">
          <label for="resCode" class="sb-form-label">자원코드</label>
          <input type="text" name="resCode" id="resCode" class="form-control" value="${resource.resCode}" required>
        </div>

        <div class="mb-3">
          <label for="resName" class="sb-form-label">자원명</label>
          <input type="text" name="resName" id="resName" class="form-control" value="${resource.resName}" required>
        </div>

        <div class="mb-3">
          <label for="resType" class="sb-form-label">자원 유형</label>
          <select name="resType" id="resType" class="form-select" required>
            <option value="ROOM" ${resource.resType == 'ROOM' ? 'selected' : ''}>회의실</option>
            <option value="EQUIPMENT" ${resource.resType == 'EQUIPMENT' ? 'selected' : ''}>장비</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="quantity" class="sb-form-label">수량</label>
          <input type="number" name="quantity" id="quantity" class="form-control" value="${resource.quantity}" min="0" required>
        </div>

        <div class="mb-4">
          <label for="remark" class="sb-form-label">비고</label>
          <input type="text" name="remark" id="remark" class="form-control" value="${resource.remark}">
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-sb">
            <i class="bi bi-check-lg"></i> 수정 완료
          </button>
          <a href="${pageContext.request.contextPath}/resv/detail?id=${resource.resId}" class="btn btn-ghost">취소</a>
        </div>
      </form>
    </div>
  </div>
</main>

<%@ include file="/layout/footer.jsp" %>
