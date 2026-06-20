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
      <p>내가 신청한 자원 예약의 진행 상태를 확인합니다.</p>
    </div>
    <div class="sb-page-head__actions">
      <a href="${pageContext.request.contextPath}/reservation/insertForm" class="btn btn-sb btn-sm">
        <i class="bi bi-calendar2-plus"></i> 예약 신청
      </a>
    </div>
  </div>

  <div class="sb-card">
    <div class="sb-card__head">
      <h2>예약 목록</h2>
      <div class="right">
        <a href="${pageContext.request.contextPath}/reservation/list" class="btn btn-ghost btn-sm ${empty status ? 'active' : ''}">전체</a>
        <a href="${pageContext.request.contextPath}/reservation/list?status=WAI" class="btn btn-ghost btn-sm">대기</a>
        <a href="${pageContext.request.contextPath}/reservation/list?status=APP" class="btn btn-ghost btn-sm">승인</a>
        <a href="${pageContext.request.contextPath}/reservation/list?status=REJ" class="btn btn-ghost btn-sm">반려</a>
      </div>
    </div>
    <div class="sb-card__body--flush">
      <table class="sb-table">
        <thead>
          <tr>
            <th>예약ID</th>
            <th>자원명</th>
            <th>신청자</th>
            <th class="num">수량</th>
            <th>상태</th>
            <th>신청일</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          <c:choose>
            <c:when test="${empty reservationList}">
              <tr>
                <td colspan="7" class="text-center text-faint py-4">예약 내역이 없습니다.</td>
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
          <a class="page-link" href="${pageContext.request.contextPath}/reservation/list?status=${status}&page=${p}">${p}</a>
        </li>
      </c:forEach>
    </ul>
  </nav>
</main>

<%@ include file="/layout/footer.jsp" %>
