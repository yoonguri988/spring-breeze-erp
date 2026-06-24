<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/layout/header.jsp" %>
<main class="sb-content">
  <div class="sb-page-head">
    <div class="sb-page-head__txt">
      <div class="sb-breadcrumb">
        <a href="${pageContext.request.contextPath}/res/list">자원 관리</a>
        <i class="bi bi-chevron-right"></i> 자원 등록
      </div>
      <h1>자원 등록</h1>
      <p>예약에 사용할 회의실, 장비, 공간 정보를 입력합니다.</p>
    </div>
  </div>

  <div class="sb-card" style="max-width:720px">
    <div class="sb-card__head">
      <h2>기본 정보</h2>
      <span class="sub">표시는 필수 입력 항목입니다.</span>
    </div>
    <div class="sb-card__body">
      <form action="${pageContext.request.contextPath}/res/insert" method="post">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>

        <div class="mb-3">
          <label for="resCode" class="sb-form-label">자원코드</label>
          <input type="text" name="resCode" id="resCode" class="form-control" placeholder="예: RM004" required>
        </div>

        <div class="mb-3">
          <label for="resName" class="sb-form-label">자원명</label>
          <input type="text" name="resName" id="resName" class="form-control" placeholder="예: 대회의실, 노트북" required>
        </div>

        <div class="mb-3">
          <label for="resType" class="sb-form-label">자원 유형</label>
          <select name="resType" id="resType" class="form-select" required>
            <option value="ROOM">회의실</option>
            <option value="EQUIPMENT">장비</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="quantity" class="sb-form-label">수량</label>
          <input type="number" name="quantity" id="quantity" class="form-control" min="0" value="1" required>
        </div>

        <div class="mb-4">
          <label for="remark" class="sb-form-label">비고</label>
          <input type="text" name="remark" id="remark" class="form-control" placeholder="필요한 설명을 입력하세요">
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-sb">
            <i class="bi bi-check-lg"></i> 등록
          </button>
          <a href="${pageContext.request.contextPath}/res/list" class="btn btn-ghost">취소</a>
        </div>
      </form>
    </div>
  </div>
</main>
<%@ include file="/layout/footer.jsp" %>