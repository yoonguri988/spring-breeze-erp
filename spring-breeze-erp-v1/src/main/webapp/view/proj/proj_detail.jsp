<%@page import="java.time.LocalDate"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp" %>
<script>
window.addEventListener("load",function(){
	let result = '${result}';
	console.log(result);

	if(result=="프로젝트 수정 실패"||result=="태스크 등록 실패"||result=="태스크 삭제 실패"){alert(result); history.go(-1);}
	else if (result.length!=0){alert(result);}
});
</script>
<main class="sb-content">
<div class="sb-page-head">
  <div class="sb-page-head__txt">
    <div class="sb-breadcrumb"><a href="${pageContext.request.contextPath}/index.jsp">홈</a> <i class="bi bi-chevron-right"></i> 업무 <i class="bi bi-chevron-right"></i> 프로젝트 <i class="bi bi-chevron-right"></i> 상세</div>
    <h1>프로젝트 상세조회</h1>
    <p>프로젝트의 기본정보, 태스크, 참여인원을 확인합니다.</p>
  </div>
  <div class="sb-page-head__actions">
    <a href="${pageContext.request.contextPath}/proj/proj_list" class="btn btn-ghost btn-sm"><i class="bi bi-list"></i> 목록</a>
    <a href="${pageContext.request.contextPath}/proj/proj_edit?pro_id=${dto.proId}" class="btn btn-ghost btn-sm"><i class="bi bi-pencil"></i> 수정</a>
    <c:if test="${isAdmin or dto.empId == loginEmpId}">
    <button type="button" class="btn btn-ghost btn-sm" style="color:var(--sb-red)" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="bi bi-trash3"></i> 삭제</button>
    </c:if>
  </div>
</div>

<!-- 삭제 확인 모달 -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title fs-5" id="exampleModalLabel">정말 삭제하시겠습니까?</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body text-center">
        프로젝트를 삭제하면 관련 데이터가
        모두 삭제되며, 복구할 수 없습니다.
        계속 진행하시겠습니까?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" data-bs-dismiss="modal">취소</button>
        <a href="${pageContext.request.contextPath}/proj/delete?pro_id=${dto.proId}" class="btn btn-danger">삭제</a>
      </div>
    </div>
  </div>
</div>

<div class="row g-3">
  <div class="col-md-7">
    <div class="sb-card">
      <div class="sb-card__head"><h2>기본정보</h2></div>
      <div class="sb-card__body--flush">
        <table class="sb-table">
          <tr><th style="width:30%">프로젝트명</th><td class="sb-table__name">${dto.proName}</td></tr>
          <tr><th>설명</th><td class="sb-table__muted">${dto.proDesc}</td></tr>
          <tr><th>상태</th><td>
            <c:choose>
              <c:when test="${dto.proStatus=='DONE'}"><span class="sb-badge sb-badge--green"><span class="pip"></span>${dto.proStatus}</span></c:when>
              <c:when test="${dto.proStatus=='DOING'}"><span class="sb-badge sb-badge--blue"><span class="pip"></span>${dto.proStatus}</span></c:when>
              <c:otherwise><span class="sb-badge sb-badge--gray"><span class="pip"></span>${dto.proStatus}</span></c:otherwise>
            </c:choose>
          </td></tr>
          <tr><th>생성자</th><td>${dto.empName}</td></tr>
          <tr><th>시작일</th><td class="tnum"><fmt:formatDate value="${dto.startDate}" pattern="yyyy-MM-dd"/></td></tr>
		  <tr><th>종료일</th><td class="tnum"><fmt:formatDate value="${dto.endDate}" pattern="yyyy-MM-dd"/></td></tr>
		  <tr><th>등록일</th><td class="tnum"><fmt:formatDate value="${dto.createdAt}" pattern="yyyy-MM-dd"/></td></tr>
        </table>
      </div>
    </div>
  </div>

  <div class="col-md-5">
    <div class="sb-card">
      <div class="sb-card__head">
        <h2>태스크목록</h2>
        <div class="right">
          <a href="${pageContext.request.contextPath}/proj/task_create?project_pro_id=${dto.proId}" class="btn btn-sb btn-sm"><i class="bi bi-plus-lg"></i> 태스크추가</a>
        </div>
      </div>
      <div class="sb-card__body--flush">
        <table class="sb-table">
          <thead>
            <tr><th>번호</th><th>업무명</th><th>상태</th><th>등록일</th></tr>
          </thead>
          <tbody>
            <c:forEach items="${list}" var="dto" varStatus="status">
              <tr>
                <td class="sb-table__muted">${paging.listtotal-(paging.current-1)*paging.onepagelist+status.index+1}</td>
                <td><a href="${pageContext.request.contextPath}/proj/task_detail?task_id=${dto.taskId}" class="sb-table__name">${dto.taskName}</a></td>
                <td>
                  <c:choose>
                    <c:when test="${dto.taskStatus=='DONE'}"><span class="sb-badge sb-badge--green"><span class="pip"></span>${dto.taskStatus}</span></c:when>
                    <c:when test="${dto.taskStatus=='DOING'}"><span class="sb-badge sb-badge--blue"><span class="pip"></span>${dto.taskStatus}</span></c:when>
                    <c:otherwise><span class="sb-badge sb-badge--gray"><span class="pip"></span>${dto.taskStatus}</span></c:otherwise>
                  </c:choose>
                </td>
                <td class="sb-hr-cell tnum"><fmt:formatDate value="${dto.taskCreatedAt}" pattern="yyyy-MM-dd"/></td>
              </tr>
            </c:forEach>
            <div class="d-flex justify-content-center py-3" style="border-top:1px solid var(--sb-border)" th:if="${paging != null}">
    <ul class="pagination pagination-sm mb-0">
      <li class="page-item" th:if="${paging.start > paging.bottomlist}">
        <a th:href="@{/proj/proj_list(pstartno=${paging.start-1}, keyword=${param.keyword}, proStatus=${param.proStatus}, startDate=${param.startDate}, endDate=${param.endDate}, searched=true)}" class="page-link">이전</a>
      </li>
      <li class="page-item" th:each="i : ${#numbers.sequence(paging.start, paging.end)}" th:classappend="${i==paging.current} ? 'active' : ''">
        <a th:href="@{/proj/proj_list(pstartno=${i}, keyword=${param.keyword}, proStatus=${param.proStatus}, startDate=${param.startDate}, endDate=${param.endDate}, searched=true)}" class="page-link" th:text="${i}"></a>
      </li>
      <li class="page-item" th:if="${paging.pagetotal > paging.end}">
        <a th:href="@{/proj/proj_list(pstartno=${paging.end+1}, keyword=${param.keyword}, proStatus=${param.proStatus}, startDate=${param.startDate}, endDate=${param.endDate}, searched=true)}" class="page-link">다음</a>
      </li>
    </ul>
  </div>
          </tbody>
        </table>
        <c:if test="${empty list}">
          <div class="sb-empty"><i class="bi bi-list-check"></i><p>등록된 태스크가 없습니다.</p></div>
        </c:if>
      </div>
    </div>
  </div>
</div>

<div class="sb-card mt-3">
  <div class="sb-card__head"><h2>참여인원</h2></div>
  <div class="sb-card__body">
    <div class="sb-avstack mb-2">
      <c:forEach items="${memberList}" var="m" varStatus="status">
        <span class="sb-avatar" title="${m.empName}">${fn:substring(m.empName,0,1)}</span>
      </c:forEach>
    </div>
    <span class="text-faint" style="font-size:13px">
      <c:forEach items="${memberList}" var="m" varStatus="status">
        ${m.empName}<c:if test="${!status.last}">, </c:if>
      </c:forEach>
      <c:if test="${empty memberList}">참여 인원이 없습니다.</c:if>
    </span>
  </div>
</div>
</main>
<%@include file="/layout/footer.jsp" %>
