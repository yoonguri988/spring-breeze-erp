<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ include file="/layout/header.jsp" %>

<main class="sb-content">
  <div class="sb-page-head">
    <div class="sb-page-head__txt">
      <div class="sb-breadcrumb">
        <a href="${pageContext.request.contextPath}/resv/list">자원 관리</a>
        <i class="bi bi-chevron-right"></i> 예약 내역
      </div>
      <h1>예약 내역</h1>
      <p>내가 요청한 자원 예약과 처리 상태를 확인합니다.</p>
      <span class="sb-badge ${isAdmin ? 'sb-badge--blue' : 'sb-badge--green'} mt-2 d-inline-block">${roleLabel}</span>
    </div>
    <div class="sb-page-head__actions">
      <a href="${pageContext.request.contextPath}/reservation/insertForm" class="btn btn-sb btn-sm">
        <i class="bi bi-calendar2-plus"></i> 예약 요청
      </a>
      <c:if test="${isAdmin}">
        <a href="${pageContext.request.contextPath}/admin/approval/list" class="btn btn-ghost btn-sm">
          <i class="bi bi-clipboard-check"></i> 승인 관리
        </a>
      </c:if>
    </div>
  </div>

  <c:if test="${error == 'notAllowed'}">
    <div class="alert alert-warning">대기 상태인 본인 예약만 수정하거나 삭제할 수 있습니다.</div>
  </c:if>

  <div class="sb-card">
    <div class="sb-card__head">
      <h2>예약 목록</h2>
      <div class="right">
        <a href="${pageContext.request.contextPath}/reservation/list" class="btn btn-ghost btn-sm ${empty status ? 'active' : ''}">전체</a>
        <a href="${pageContext.request.contextPath}/reservation/list?status=WAI" class="btn btn-ghost btn-sm ${status == 'WAI' ? 'active' : ''}">대기</a>
        <a href="${pageContext.request.contextPath}/reservation/list?status=APP" class="btn btn-ghost btn-sm ${status == 'APP' ? 'active' : ''}">승인</a>
        <a href="${pageContext.request.contextPath}/reservation/list?status=REJ" class="btn btn-ghost btn-sm ${status == 'REJ' ? 'active' : ''}">반려</a>
      </div>
    </div>
    <div class="sb-card__body--flush">
      <table class="sb-table">
        <thead>
          <tr>
            <th>예약 ID</th>
            <th>자원명</th>
            <th>요청자</th>
            <th class="num">수량</th>
            <th>상태</th>
            <th>요청일</th>
            <th>비고</th>
            <th class="text-end">관리</th>
          </tr>
        </thead>
        <tbody>
          <c:choose>
            <c:when test="${empty reservationList}">
              <tr>
                <td colspan="8" class="text-center text-faint py-4">예약 내역이 없습니다.</td>
              </tr>
            </c:when>
            <c:otherwise>
              <c:forEach var="r" items="${reservationList}">
                <tr>
                  <td>${r.revId}</td>
                  <td><b>${r.resName}</b></td>
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
                  <td>${empty r.remark ? '-' : r.remark}</td>
                  <td class="text-end">
                    <c:if test="${r.status == 'WAI' and (isAdmin or loginEmpId == r.empId)}">
                      <a href="${pageContext.request.contextPath}/reservation/update?id=${r.revId}" class="btn btn-ghost btn-sm">수정</a>
                      <form action="${pageContext.request.contextPath}/reservation/delete" method="post" class="d-inline" onsubmit="return confirm('이 예약 요청을 삭제하시겠습니까?');">
                        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
                        <input type="hidden" name="revId" value="${r.revId}">
                        <button type="submit" class="btn btn-ghost btn-sm text-danger">삭제</button>
                      </form>
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
        <a class="page-link" href="${pageContext.request.contextPath}/reservation/list?status=${status}&page=${paging.current - 1}">이전</a>
      </li>
      <c:forEach var="p" begin="${paging.start}" end="${paging.end}">
        <li class="page-item ${p == paging.current ? 'active' : ''}">
          <a class="page-link" href="${pageContext.request.contextPath}/reservation/list?status=${status}&page=${p}">${p}</a>
        </li>
      </c:forEach>
      <li class="page-item ${paging.current >= paging.pagetotal ? 'disabled' : ''}">
        <a class="page-link" href="${pageContext.request.contextPath}/reservation/list?status=${status}&page=${paging.current + 1}">다음</a>
      </li>
    </ul>
  </nav>
</main>

<%@ include file="/layout/footer.jsp" %>
