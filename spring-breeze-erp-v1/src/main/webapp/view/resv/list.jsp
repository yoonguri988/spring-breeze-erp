<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ include file="/layout/header.jsp" %>

<main class="sb-content">
  <div class="sb-page-head">
    <div class="sb-page-head__txt">
      <div class="sb-breadcrumb">
        <i class="bi bi-house-door"></i>
        <i class="bi bi-chevron-right"></i> 자산
        <i class="bi bi-chevron-right"></i> 자원 관리
      </div>
      <h1>자원 관리</h1>
      <p>회의실과 장비 같은 예약 자원을 조회하고 관리합니다.</p>
      <span class="sb-badge ${isAdmin ? 'sb-badge--blue' : 'sb-badge--green'} mt-2 d-inline-block">${roleLabel}</span>
    </div>
    <div class="sb-page-head__actions">
      <c:if test="${isAdmin}">
        <a href="${pageContext.request.contextPath}/resv/insert" class="btn btn-sb btn-sm">
          <i class="bi bi-plus-lg"></i> 자원 등록
        </a>
      </c:if>
      <a href="${pageContext.request.contextPath}/reservation/insertForm" class="btn btn-ghost btn-sm">
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
    <div class="alert alert-warning">관리자만 자원 등록, 수정, 삭제와 예약 승인 관리 기능을 사용할 수 있습니다.</div>
  </c:if>
  <c:if test="${error == 'notFound'}">
    <div class="alert alert-warning">요청한 자원을 찾을 수 없습니다.</div>
  </c:if>

  <div class="row g-3 mb-3">
    <div class="col-4">
      <div class="sb-card p-3 d-flex align-items-center gap-3">
        <span class="sb-stat__ico tone-blue"><i class="bi bi-collection"></i></span>
        <div>
          <div class="text-faint" style="font-size:12px">전체 자원</div>
          <div style="font-weight:750;font-size:17px">${totalResourceCount}</div>
        </div>
      </div>
    </div>
    <div class="col-4">
      <div class="sb-card p-3 d-flex align-items-center gap-3">
        <span class="sb-stat__ico tone-violet"><i class="bi bi-door-open"></i></span>
        <div>
          <div class="text-faint" style="font-size:12px">회의실</div>
          <div style="font-weight:750;font-size:17px">${roomResourceCount}</div>
        </div>
      </div>
    </div>
    <div class="col-4">
      <div class="sb-card p-3 d-flex align-items-center gap-3">
        <span class="sb-stat__ico tone-amber"><i class="bi bi-laptop"></i></span>
        <div>
          <div class="text-faint" style="font-size:12px">장비</div>
          <div style="font-weight:750;font-size:17px">${equipmentResourceCount}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="sb-card">
    <div class="sb-card__head">
      <h2>자원 목록</h2>
      <div class="right">
        <c:choose>
          <c:when test="${isAdmin}">
            <a href="${pageContext.request.contextPath}/admin/approval/list" class="btn btn-ghost btn-sm">예약 승인 관리</a>
          </c:when>
          <c:otherwise>
            <span class="text-faint" style="font-size:12px">관리자 승인 화면은 관리자만 접근할 수 있습니다.</span>
          </c:otherwise>
        </c:choose>
      </div>
    </div>
    <div class="sb-card__body">
      <form action="${pageContext.request.contextPath}/resv/list" method="get" class="row g-2 align-items-center">
        <div class="col-12 col-md-5">
          <input type="text" name="keyword" value="${keyword}" class="form-control" placeholder="자원명 또는 자원코드를 검색하세요.">
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
                      <c:when test="${r.resType == 'ROOM'}"><span class="sb-badge sb-badge--blue">회의실</span></c:when>
                      <c:when test="${r.resType == 'EQUIPMENT'}"><span class="sb-badge sb-badge--amber">장비</span></c:when>
                      <c:otherwise><span class="sb-badge">${r.resType}</span></c:otherwise>
                    </c:choose>
                  </td>
                  <td class="num">${r.quantity}</td>
                  <td>${empty r.remark ? '-' : r.remark}</td>
                  <td class="text-end">
                    <a href="${pageContext.request.contextPath}/resv/detail?id=${r.resId}" class="btn btn-ghost btn-sm">상세</a>
                    <c:if test="${isAdmin}">
                      <a href="${pageContext.request.contextPath}/resv/update?id=${r.resId}" class="btn btn-ghost btn-sm">수정</a>
                      <button type="button" class="btn btn-ghost btn-sm text-danger" onclick="openDeleteModal('${r.resId}', 'list')">삭제</button>
                    </c:if>
                  </td>
                </tr>
              </c:forEach>
            </c:otherwise>
          </c:choose>
        </tbody>
      </table>
    </div>
  </div>

  <nav class="mt-3">
    <ul class="pagination justify-content-center">
      <li class="page-item ${paging.current <= 1 ? 'disabled' : ''}">
        <a class="page-link" href="${pageContext.request.contextPath}/resv/list?page=${paging.current - 1}&keyword=${keyword}&resType=${resType}">이전</a>
      </li>
      <c:forEach var="i" begin="${paging.start}" end="${paging.end}">
        <li class="page-item ${i == paging.current ? 'active' : ''}">
          <a class="page-link" href="${pageContext.request.contextPath}/resv/list?page=${i}&keyword=${keyword}&resType=${resType}">${i}</a>
        </li>
      </c:forEach>
      <li class="page-item ${paging.current >= paging.pagetotal ? 'disabled' : ''}">
        <a class="page-link" href="${pageContext.request.contextPath}/resv/list?page=${paging.current + 1}&keyword=${keyword}&resType=${resType}">다음</a>
      </li>
    </ul>
  </nav>
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
