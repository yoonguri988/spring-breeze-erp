<%@page import="java.time.LocalDate"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="/layout/header.jsp" %>
<style>
/* proj_list 상태필터는 <a> 태그라 sb-segment의 button 전용 스타일을 보강 */
.sb-segment a { border:none; background:transparent; font-size:13px; font-weight:600; color:var(--sb-ink-soft); padding:6px 13px; border-radius:7px; display:inline-flex; align-items:center; gap:6px; }
.sb-segment a.active { background:#fff; color:var(--sb-accent); box-shadow:var(--sb-shadow-sm); }
</style>
<script>
window.addEventListener("load",function(){
	let result = '${result}';
	console.log(result);

	if(result=="프로젝트 등록 실패"||result=="프로젝트 삭제 실패"){alert(result); history.go(-1);}
	else if (result.length!=0){alert(result);}
});
</script>

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
    <form action="${pageContext.request.contextPath}/proj/search" method="get" class="sb-field sb-field--search">
      <i class="bi bi-search"></i>
      <input type="text" name="keyword" placeholder="프로젝트명 검색" value="${param.keyword}">
      <button type="submit" class="btn btn-sb-soft btn-sm ms-2">조회</button>
    </form>

    <div class="sb-segment">
      <a href="${pageContext.request.contextPath}/proj/proj_list" class="${empty param.pro_status ? 'active' : ''}">전체</a>
      <a href="${pageContext.request.contextPath}/proj/status?pro_status=TODO" class="${param.pro_status=='TODO' ? 'active' : ''}"><span class="sb-dot" style="background:var(--sb-ink-faint);width:6px;height:6px;"></span> TODO</a>
      <a href="${pageContext.request.contextPath}/proj/status?pro_status=DOING" class="${param.pro_status=='DOING' ? 'active' : ''}"><span class="sb-dot" style="background:var(--sb-accent);width:6px;height:6px;"></span> DOING</a>
      <a href="${pageContext.request.contextPath}/proj/status?pro_status=DONE" class="${param.pro_status=='DONE' ? 'active' : ''}"><span class="sb-dot" style="background:var(--sb-green);width:6px;height:6px;"></span> DONE</a>
    </div>

    <div class="grow"></div>

    <form action="${pageContext.request.contextPath}/proj/period" method="get" class="d-flex align-items-center gap-2 flex-nowrap">
      <i class="bi bi-calendar3 text-faint"></i>
      <input type="date" name="startDate" class="form-control" style="height:36px;width:150px;" value="${param.startDate}" required>
      <span class="text-faint">~</span>
      <input type="date" name="endDate" class="form-control" style="height:36px;width:150px;" value="${param.endDate}" required>
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

<%@include file="/layout/footer.jsp" %>
