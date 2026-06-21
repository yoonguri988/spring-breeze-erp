<%@page import="java.time.LocalDate"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="/layout/header.jsp" %>
<script>
window.addEventListener("load",function(){
	let result = '${result}';
	console.log(result);

	if(result=="프로젝트 등록 실패"||result=="프로젝트 삭제 실패"){alert(result); history.go(-1);}
	else if (result.length!=0){alert(result);}
});
</script>
<main class="sb-content">
<div class="sb-page-head">
  <div class="sb-page-head__txt">
    <div class="sb-breadcrumb"><a href="${pageContext.request.contextPath}/index.jsp">홈</a> <i class="bi bi-chevron-right"></i> 업무 <i class="bi bi-chevron-right"></i> 프로젝트</div>
    <h1>프로젝트 목록</h1>
    <p>전체 프로젝트 현황을 조회하고 관리합니다.</p>
  </div>
  <div class="sb-page-head__actions my-3">
    <a href="${pageContext.request.contextPath}/proj/proj_create" class="btn btn-sb btn-sm"><i class="bi bi-folder-plus"></i> 프로젝트 생성</a>
  </div>
</div>

<div class="sb-card mb-3">
  <div class="sb-toolbar">
  <form id="searchForm" action="${pageContext.request.contextPath}/proj/proj_list" method="get" class="sb-search-form">

    <div class="sb-field sb-field--search">
      <i class="bi bi-search"></i>
      <input type="text" name="keyword" placeholder="프로젝트명 검색" value="${param.keyword}">
    </div>

    <input type="hidden" name="proStatus" id="proStatus" value="${param.proStatus}">

    <div class="sb-segment">
      <a href="#" onclick="setStatus(''); return false;" class="${empty param.proStatus ? 'active' : ''}">전체</a>
      <a href="#" onclick="setStatus('TODO'); return false;" class="${param.proStatus=='TODO' ? 'active' : ''}"><span class="sb-dot" style="background:var(--sb-ink-faint);width:6px;height:6px;"></span> TODO</a>
      <a href="#" onclick="setStatus('DOING'); return false;" class="${param.proStatus=='DOING' ? 'active' : ''}"><span class="sb-dot" style="background:var(--sb-accent);width:6px;height:6px;"></span> DOING</a>
      <a href="#" onclick="setStatus('DONE'); return false;" class="${param.proStatus=='DONE' ? 'active' : ''}"><span class="sb-dot" style="background:var(--sb-green);width:6px;height:6px;"></span> DONE</a>
    </div>

    <div class="grow"></div>

    <div class="sb-field sb-field--date">
      <i class="bi bi-calendar3"></i>
      <input type="date" name="startDate" value="${param.startDate}">
    </div>
    <span class="text-faint">~</span>
    <div class="sb-field">
      <input type="date" name="endDate" value="${param.endDate}">
    </div>

    <button type="submit" class="btn btn-sb-soft btn-sm">조회</button>
  </form>
  </div>

  <div class="sb-card__body--flush">
    <table class="sb-table">
      <thead>
        <tr>
          <th>프로젝트명</th>
          <th>설명</th>
          <th>생성자</th>
          <th>참여인원</th>
          <th>기간</th>
          <th>등록일</th>
        </tr>
      </thead>
      <tbody>
        <c:forEach items="${list}" var="dto" varStatus="status">
          <tr>
            <td><a href="${pageContext.request.contextPath}/proj/proj_detail?pro_id=${dto.proId}" class="sb-table__name">${dto.proName}</a></td>
            <td class="sb-table__muted">${dto.proDesc}</td>
            <td>${dto.empName}</td>
            <td>
              <a href="${pageContext.request.contextPath}/proj/proj_member?pro_id=${dto.proId}" class="sb-iconbtn" style="width:28px;height:28px;font-size:14px;display:inline-grid;"><i class="bi bi-people"></i></a>
              ${dto.memberCnt}명
            </td>
            <td class="sb-hr-cell tnum"><fmt:formatDate value="${dto.startDate}" pattern="yyyy-MM-dd"/> ~ <fmt:formatDate value="${dto.endDate}" pattern="yyyy-MM-dd"/></td>
            <td class="sb-hr-cell tnum"><fmt:formatDate value="${dto.createdAt}" pattern="yyyy-MM-dd"/></td>
          </tr>
        </c:forEach>
      </tbody>
    </table>
    <c:if test="${empty list}">
      <div class="sb-empty"><i class="bi bi-folder2-open"></i><p>조회된 프로젝트가 없습니다.</p></div>
    </c:if>
  </div>
<c:if test="${not empty paging}">
  <div class="d-flex justify-content-center py-3" style="border-top:1px solid var(--sb-border)">
    <ul class="pagination pagination-sm mb-0">
      <c:if test="${paging.start > paging.bottomlist}">
        <li class="page-item"><a href="?pstartno=${paging.start-1}" class="page-link">이전</a></li>
      </c:if>
      <c:forEach var="i" begin="${paging.start}" end="${paging.end}">
        <li class="page-item <c:if test="${i==paging.current}">active</c:if>">
          <a href="?pstartno=${i}" class="page-link">${i}</a>
        </li>
      </c:forEach>
      <c:if test="${paging.pagetotal > paging.end}">
        <li class="page-item"><a href="?pstartno=${paging.end+1}" class="page-link">다음</a></li>
      </c:if>
    </ul>
  </div>
 </c:if>
</div>
</main>
<script>
function setStatus(status) {
  document.getElementById('proStatus').value = status;
  document.getElementById('searchForm').submit();
}
</script>
<%@include file="/layout/footer.jsp" %>
