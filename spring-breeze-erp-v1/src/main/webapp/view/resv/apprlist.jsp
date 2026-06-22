<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ include file="/layout/header.jsp" %>

<main class="sb-content">
  <div class="sb-page-head">
    <div class="sb-page-head__txt">
      <div class="sb-breadcrumb">
        <a href="${pageContext.request.contextPath}/resv/list">자원 관리</a>
        <i class="bi bi-chevron-right"></i> 예약 승인 관리
      </div>
      <h1>예약 승인 관리</h1>
      <p>자원 예약 신청을 확인하고 승인 또는 반려 처리합니다.</p>
    </div>
  </div>

  <c:if test="${param.error == 'noReason'}">
    <div class="alert alert-danger">반려 사유를 입력해야 합니다.</div>
  </c:if>

  <div class="row g-3 mb-3">
    <div class="col-6 col-md-3">
      <div class="sb-card p-3">
        <div class="text-faint" style="font-size:12px">전체</div>
        <div style="font-weight:750;font-size:22px">${stats.resvTotal}</div>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="sb-card p-3">
        <div class="text-faint" style="font-size:12px">대기</div>
        <div class="text-warning" style="font-weight:750;font-size:22px">${stats.waiTotal}</div>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="sb-card p-3">
        <div class="text-faint" style="font-size:12px">승인</div>
        <div class="text-success" style="font-weight:750;font-size:22px">${stats.appTotal}</div>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="sb-card p-3">
        <div class="text-faint" style="font-size:12px">반려</div>
        <div class="text-danger" style="font-weight:750;font-size:22px">${stats.rejTotal}</div>
      </div>
    </div>
  </div>

  <div class="sb-card">
    <div class="sb-card__head">
      <h2>예약 신청 목록</h2>
      <div class="right">
        <a class="btn btn-ghost btn-sm ${empty status ? 'active' : ''}" href="${pageContext.request.contextPath}/admin/approval/list">전체</a>
        <a class="btn btn-ghost btn-sm ${status == 'WAI' ? 'active' : ''}" href="${pageContext.request.contextPath}/admin/approval/list?status=WAI">대기</a>
        <a class="btn btn-ghost btn-sm ${status == 'APP' ? 'active' : ''}" href="${pageContext.request.contextPath}/admin/approval/list?status=APP">승인</a>
        <a class="btn btn-ghost btn-sm ${status == 'REJ' ? 'active' : ''}" href="${pageContext.request.contextPath}/admin/approval/list?status=REJ">반려</a>
      </div>
    </div>
    <div class="sb-card__body--flush">
      <table class="sb-table">
        <thead>
          <tr>
            <th>예약ID</th>
            <th>자원명</th>
            <th>부서</th>
            <th>신청자</th>
            <th class="num">수량</th>
            <th>상태</th>
            <th>신청일</th>
            <th class="text-end">관리</th>
          </tr>
        </thead>
        <tbody>
          <c:choose>
            <c:when test="${empty reservationList}">
              <tr>
                <td colspan="8" class="text-center text-faint py-4">예약 신청 내역이 없습니다.</td>
              </tr>
            </c:when>
            <c:otherwise>
              <c:forEach var="r" items="${reservationList}">
                <tr>
                  <td>${r.revId}</td>
                  <td><b>${r.resName}</b></td>
                  <td>${r.deptName}</td>
                  <td>${r.empName}</td>
                  <td class="num">${r.quantity}</td>
                  <td>
                    <c:choose>
                      <c:when test="${r.status == 'WAI'}"><span class="sb-badge sb-badge--amber">대기</span></c:when>
                      <c:when test="${r.status == 'APP'}"><span class="sb-badge sb-badge--green">승인</span></c:when>
                      <c:when test="${r.status == 'REJ'}"><span class="sb-badge sb-badge--red">반려</span></c:when>
                      <c:otherwise><span class="sb-badge">${r.status}</span></c:otherwise>
                    </c:choose>
                  </td>
                  <td>${r.reqDate}</td>
                  <td class="text-end">
                    <c:if test="${r.status == 'WAI'}">
                      <form action="${pageContext.request.contextPath}/admin/approval/approve" method="post" class="d-inline" onsubmit="return confirm('승인하시겠습니까?');">
                        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
                        <input type="hidden" name="revId" value="${r.revId}">
                        <button type="submit" class="btn btn-sb btn-sm">승인</button>
                      </form>
                      <button type="button" class="btn btn-ghost btn-sm text-danger" data-bs-toggle="modal" data-bs-target="#rejectModal" onclick="setRejectRevId(${r.revId})">반려</button>
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
      <c:forEach var="p" begin="${paging.start}" end="${paging.end}">
        <li class="page-item ${p == paging.current ? 'active' : ''}">
          <a class="page-link" href="${pageContext.request.contextPath}/admin/approval/list?status=${status}&page=${p}">${p}</a>
        </li>
      </c:forEach>
    </ul>
  </nav>
</main>

<div class="modal fade" id="rejectModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <form action="${pageContext.request.contextPath}/admin/approval/reject" method="post">
        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
        <div class="modal-header">
          <h5 class="modal-title">예약 반려</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" name="revId" id="rejectRevId">
          <label class="sb-form-label">반려 사유</label>
          <textarea name="rejectReason" class="form-control" rows="3" required></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost" data-bs-dismiss="modal">취소</button>
          <button type="submit" class="btn btn-danger">반려 처리</button>
        </div>
      </form>
    </div>
  </div>
</div>

<script>
  function setRejectRevId(revId) {
    document.getElementById('rejectRevId').value = revId;
  }
</script>

<%@ include file="/layout/footer.jsp" %>
