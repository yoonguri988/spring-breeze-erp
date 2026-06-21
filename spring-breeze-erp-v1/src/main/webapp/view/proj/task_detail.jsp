<%@page import="java.time.LocalDate"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp" %>
<script>
window.addEventListener("load",function(){
	let result = '${result}';
	console.log(result);

	if(result=="태스크 수정 실패"){alert(result); history.go(-1);}
	else if (result.length!=0){alert(result);}
});
</script>

<div class="sb-page-head">
  <div class="sb-page-head__txt">
    <div class="sb-breadcrumb"><a href="${pageContext.request.contextPath}/index.jsp">홈</a> <i class="bi bi-chevron-right"></i> 업무 <i class="bi bi-chevron-right"></i> 프로젝트 <i class="bi bi-chevron-right"></i> 태스크 상세</div>
    <h1>태스크 상세조회</h1>
  </div>
  <div class="sb-page-head__actions">
    <a href="${pageContext.request.contextPath}/proj/proj_list" class="btn btn-ghost btn-sm"><i class="bi bi-list"></i> 목록</a>
    <a href="${pageContext.request.contextPath}/proj/task_edit?task_id=${dto.taskId}&project_pro_id=${pro_id}" class="btn btn-ghost btn-sm"><i class="bi bi-pencil"></i> 수정</a>
    <button type="button" class="btn btn-ghost btn-sm" style="color:var(--sb-red)" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="bi bi-trash3"></i> 삭제</button>
  </div>
</div>

<input type="hidden" name="taskId" value="${dto.taskId}">
<input type="hidden" name="projectProId" value="${pro_id}">

<!-- 삭제 확인 모달 -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title fs-5" id="exampleModalLabel">정말 삭제하시겠습니까?</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body text-center">
        태스크를 삭제하면 관련 데이터가
        모두 삭제되며, 복구할 수 없습니다.
        계속 진행하시겠습니까?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" data-bs-dismiss="modal">취소</button>
        <a href="${pageContext.request.contextPath}/proj/task_delete?task_id=${dto.taskId}&pro_id=${pro_id}" class="btn btn-danger">삭제</a>
      </div>
    </div>
  </div>
</div>

<div class="sb-card">
  <div class="sb-card__head"><h2>태스크 상세조회</h2></div>
  <div class="sb-card__body--flush">
    <table class="sb-table">
      <tr><th style="width:25%">태스크명</th><td class="sb-table__name">${dto.taskName}</td></tr>
      <tr><th>태스크설명</th><td class="sb-table__muted">${dto.taskDesc}</td></tr>
      <tr><th>태스크상태</th><td>
        <c:choose>
          <c:when test="${dto.taskStatus=='DONE'}"><span class="sb-badge sb-badge--green"><span class="pip"></span>${dto.taskStatus}</span></c:when>
          <c:when test="${dto.taskStatus=='DOING'}"><span class="sb-badge sb-badge--blue"><span class="pip"></span>${dto.taskStatus}</span></c:when>
          <c:otherwise><span class="sb-badge sb-badge--gray"><span class="pip"></span>${dto.taskStatus}</span></c:otherwise>
        </c:choose>
      </td></tr>
      <tr><th>담당자이름</th><td>${dto.pmIdName}</td></tr>
      <tr><th>태스크시작일</th><td class="tnum">${dto.taskStartDate}</td></tr>
      <tr><th>태스크종료일</th><td class="tnum">${dto.taskEndDate}</td></tr>
    </table>
  </div>
</div>

<%@include file="/layout/footer.jsp" %>
