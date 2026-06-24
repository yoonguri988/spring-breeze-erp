<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ include file="/layout/header.jsp" %>

<main class="sb-content">
  <div class="sb-page-head">
    <div class="sb-page-head__txt">
      <div class="sb-breadcrumb">
        <a href="${pageContext.request.contextPath}/resv/list">자원 관리</a>
        <i class="bi bi-chevron-right"></i> 예약 요청
      </div>
      <h1>예약 요청</h1>
      <p>사용할 자원과 수량을 선택해 예약 요청을 등록합니다.</p>
    </div>
  </div>

  <div class="sb-card" style="max-width:720px">
    <div class="sb-card__head">
      <h2>예약 정보</h2>
    </div>
    <div class="sb-card__body">
      <form action="${pageContext.request.contextPath}/resv/insert" method="post">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>

        <div class="mb-3">
          <label for="resId" class="sb-form-label">예약 자원</label>
          <select name="resId" id="resId" class="form-select" required>
            <c:forEach var="r" items="${resourceList}">
              <option value="${r.resId}" ${resource != null && resource.resId == r.resId ? 'selected' : ''}>
                ${r.resName} (${r.resCode}) / 보유 수량 ${r.quantity}
              </option>
            </c:forEach>
          </select>
        </div>

        <div class="mb-3">
          <label for="quantity" class="sb-form-label">예약 수량</label>
          <input type="number" name="quantity" id="quantity" class="form-control" min="1" value="1" required>
        </div>

        <div class="mb-4">
          <label for="remark" class="sb-form-label">요청 사유</label>
          <textarea name="remark" id="remark" class="form-control" rows="4"></textarea>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-sb">
            <i class="bi bi-check-lg"></i> 요청 등록
          </button>
          <a href="${pageContext.request.contextPath}/resv/list" class="btn btn-ghost">취소</a>
        </div>
      </form>
    </div>
  </div>
</main>

<%@ include file="/layout/footer.jsp" %>
