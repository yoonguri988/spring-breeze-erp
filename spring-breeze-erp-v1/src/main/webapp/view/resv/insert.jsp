<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ include file="/layout/header.jsp" %>
<main class="sb-content">
  <div class="sb-page-head">
    <div class="sb-page-head__txt">
      <div class="sb-breadcrumb">
        <a href="${pageContext.request.contextPath}/res/list">자원 관리</a>
        <i class="bi bi-chevron-right"></i> 예약 신청
      </div>
      <h1>자원 예약 신청</h1>
      <p>사용할 자원과 수량을 선택하면 관리자 승인 대기 상태로 접수됩니다.</p>
    </div>
  </div>
  <div class="sb-card" style="max-width:720px">
    <div class="sb-card__head">
      <h2>예약 정보</h2>
      <span class="sub">예약 상태는 최초 대기로 저장됩니다.</span>
    </div>
    <div class="sb-card__body">
      <form action="${pageContext.request.contextPath}/resv/insert" method="post">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
        <div class="mb-3">
          <label for="resId" class="sb-form-label">예약 자원</label>
          <select name="resId" id="resId" class="form-select" required>
            <option value="">자원을 선택하세요</option>
            <c:forEach var="r" items="${resourceList}">
              <option value="${r.resId}" ${not empty resource and resource.resId == r.resId ? 'selected' : ''}>
                ${r.resName} (${r.resCode}) / 보유 수량 ${r.quantity}
              </option>
            </c:forEach>
          </select>
        </div>
        <c:if test="${not empty resource}">
          <div class="mb-3 p-3" style="background:var(--sb-accent-soft);border-radius:10px">
            <div class="text-faint mb-1">선택된 자원</div>
            <div style="font-weight:750">${resource.resName}</div>
            <div class="text-soft">${resource.resCode} / 보유 수량 ${resource.quantity}</div>
          </div>
        </c:if>
        <div class="mb-3">
          <label for="quantity" class="sb-form-label">예약 수량</label>
          <input type="number" name="quantity" id="quantity" class="form-control" min="1" value="1" required>
        </div>
        <div class="mb-4">
          <label for="remark" class="sb-form-label">신청 사유</label>
          <textarea name="remark" id="remark" class="form-control" rows="4" placeholder="사용 목적이나 요청 사항을 입력하세요"></textarea>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-sb">
            <i class="bi bi-check-lg"></i> 예약 신청
          </button>
          <a href="${pageContext.request.contextPath}/res/list" class="btn btn-ghost">취소</a>
        </div>
      </form>
    </div>
  </div>
</main>
<%@ include file="/layout/footer.jsp" %>