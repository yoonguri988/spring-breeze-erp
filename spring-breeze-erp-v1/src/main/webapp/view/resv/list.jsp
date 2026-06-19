<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ include file="/layout/header.jsp" %>

<main class="sb-content">
  <div class="sb-page-head">
    <div class="sb-page-head__txt">
      <div class="sb-breadcrumb">
        <i class="bi bi-house-door"></i> 홈
        <i class="bi bi-chevron-right"></i> 자산
        <i class="bi bi-chevron-right"></i> 자원 관리
      </div>
      <h1>자원 관리</h1>
      <p>회의실, 장비 등 예약 가능한 자원을 등록하고 관리합니다.</p>
    </div>
    <div class="sb-page-head__actions">
      <a href="${pageContext.request.contextPath}/resv/insert" class="btn btn-sb btn-sm">
        <i class="bi bi-plus-lg"></i> 자원 등록
      </a>
      <a href="${pageContext.request.contextPath}/reservation/insertForm" class="btn btn-ghost btn-sm">
        <i class="bi bi-calendar2-plus"></i> 예약 신청
      </a>
    </div>
  </div>

  <c:if test="${error == 'badPassword'}">
    <div class="alert alert-danger">비밀번호가 일치하지 않아 삭제되지 않았습니다.</div>
  </c:if>

  <div class="row g-3 mb-3">
    <div class="col-6 col-md-3">
      <div class="sb-card p-3 d-flex align-items-center gap-3">
        <span class="sb-stat__ico tone-blue"><i class="bi bi-collection"></i></span>
        <div>
          <div class="text-faint" style="font-size:12px">등록 자원</div>
          <div style="font-weight:750;font-size:17px">${paging.listtotal}</div>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="sb-card p-3 d-flex align-items-center gap-3">
        <span class="sb-stat__ico tone-violet"><i class="bi bi-door-open"></i></span>
        <div>
          <div class="text-faint" style="font-size:12px">회의실/공간</div>
          <div style="font-weight:750;font-size:17px">ROOM</div>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="sb-card p-3 d-flex align-items-center gap-3">
        <span class="sb-stat__ico tone-amber"><i class="bi bi-laptop"></i></span>
        <div>
          <div class="text-faint" style="font-size:12px">장비</div>
          <div style="font-weight:750;font-size:17px">EQUIPMENT</div>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="sb-card p-3 d-flex align-items-center gap-3">
        <span class="sb-stat__ico tone-green"><i class="bi bi-calendar2-check"></i></span>
        <div>
          <div class="text-faint" style="font-size:12px">예약 승인</div>
          <div style="font-weight:750;font-size:17px">
            <a href="${pageContext.request.contextPath}/admin/approval/list">관리</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="sb-card">
    <div class="sb-card__head">
      <h2>자원 목록</h2>
      <span class="sub">검색 조건에 맞는 자원을 확인합니다.</span>
    </div>
    <div class="sb-card__body">
      <form action="${pageContext.request.contextPath}/resv/list" method="get" class="row g-2 align-items-center">
        <div class="col-12 col-md-5">
          <input type="text" name="keyword" value="${keyword}" class="form-control" placeholder="자원명 또는 자원코드 검색">
        </div>
        <div class="col-12 col-md-3">
          <select name="resType" class="form-select">
            <option value="" ${empty resType ? 'selected' : ''}>전체 유형</option>
            <option value="ROOM" ${resType == 'ROOM' ? 'selected' : ''}>회의실</option>
            <option value="EQUIPMENT" ${resType == 'EQUIPMENT' ? 'selected' : ''}>장비</option>
          </select>
        </div>
        <div class="col-12 col-md-auto">
          <button type="submit" class="btn btn-sb">
            <i class="bi bi-search"></i> 검색
          </button>
        </div>
      </form>
    </div>
    <div class="sb-card__body--flush">
      <table class="sb-table">
        <thead>
          <tr>
            <th>자원코드</th>
            <th>자원명</th>
            <th>유형</th>
            <th class="num">수량</th>
            <th>비고</th>
            <th class="text-end">관리</th>
          </tr>
        </thead>
        <tbody>
          <c:choose>
            <c:when test="${empty resourceList}">
              <tr>
                <td colspan="6" class="text-center text-faint py-4">등록된 자원이 없습니다.</td>
              </tr>
            </c:when>
            <c:otherwise>
              <c:forEach var="r" items="${resourceList}">
                <tr>
                  <td><b>${r.resCode}</b></td>
                  <td>${r.resName}</td>
                  <td>
                    <c:choose>
                      <c:when test="${r.resType == 'ROOM'}">
                        <span class="sb-badge sb-badge--blue">회의실</span>
                      </c:when>
                      <c:when test="${r.resType == 'EQUIPMENT'}">
                        <span class="sb-badge sb-badge--amber">장비</span>
                      </c:when>
                      <c:otherwise>
                        <span class="sb-badge">${r.resType}</span>
                      </c:otherwise>
                    </c:choose>
                  </td>
                  <td class="num">${r.quantity}</td>
                  <td>${empty r.remark ? '-' : r.remark}</td>
                  <td class="text-end">
                    <a href="${pageContext.request.contextPath}/resv/detail?id=${r.resId}" class="btn btn-ghost btn-sm">상세</a>
                    <sec:authorize access="hasRole('ROLE_ADMIN')">
                      <a href="${pageContext.request.contextPath}/resv/update?id=${r.resId}" class="btn btn-ghost btn-sm">수정</a>
                      <button type="button" class="btn btn-ghost btn-sm text-danger" onclick="submitDelete('${r.resId}', 'list')">삭제</button>
                    </sec:authorize>
                  </td>
                </tr>
              </c:forEach>
            </c:otherwise>
          </c:choose>
        </tbody>
      </table>
    </div>
  </div>

  <form id="deleteForm" action="${pageContext.request.contextPath}/resv/delete" method="post" style="display:none;">
    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
    <input type="hidden" name="id" id="deleteResId">
    <input type="hidden" name="password" id="deletePassword">
    <input type="hidden" name="returnTo" id="deleteReturnTo">
  </form>

  <nav class="mt-3">
    <ul class="pagination justify-content-center">
      <c:forEach var="i" begin="${paging.start}" end="${paging.end}">
        <li class="page-item ${i == paging.current ? 'active' : ''}">
          <a class="page-link" href="${pageContext.request.contextPath}/resv/list?page=${i}&keyword=${keyword}&resType=${resType}">${i}</a>
        </li>
      </c:forEach>
    </ul>
  </nav>
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
