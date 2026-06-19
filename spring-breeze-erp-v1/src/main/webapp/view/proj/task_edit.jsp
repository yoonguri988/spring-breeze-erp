<%@page import="java.time.LocalDate"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp" %>
<%String today = LocalDate.now().toString(); %>
<div class="container my-5 ms-5">
<p>홈 > 프로젝트 > 프로젝트 상세 > 태스크 상세 > 태스크 수정</p>
<h3 class="card-header">태스크 수정</h3>
<hr>
<form action="${pageContext.request.contextPath}/proj/task_edit" method="post" onsubmit="check()">
<input  type="hidden" name="${_csrf.parameterName}"  value="${_csrf.token}" />
<input type="hidden" name="taskId" value="${dto.taskId}">

<div class="my-4" style="display:grid; grid-template-columns:150px 1fr; gap:10px; margin-bottom:15px;">
<label for="taskName" class="form-label-mb-3">태스크명</label>
<input type="text" id="task_name" name="taskName" class="form-control" value="${dto.taskName}"/>
</div>
<div style="display:grid; grid-template-columns:150px 1fr; gap:10px; margin-bottom:15px;">
<label for="taskDesc" class="form-label">태스크 설명</label>
<input id="task_desc" name="taskDesc" class="form-control p-5" value="${taskDesc}"/>
</div>
<div style="display:grid; grid-template-columns:150px 1fr; gap:10px; margin-bottom:15px;">
<label for="taskStatus" class="form-label">상태</label>
<select id="task_status" name="taskStatus" class="form-select">
    <option value="" disabled selected>상태를 입력하세요</option>
	<option value="TODO">TODO</option>
	<option value="DOING">DOING</option>
	<option value="DONE">DONE</option>
</select>
</div>
<div style="display:grid; grid-template-columns:150px 1fr; gap:10px; margin-bottom:15px;">
<label for="pmId" class="form-label">담당자</label>
<select id="pm_id_name" name="pmId" class="form-select">
	<c:forEach items="${memberlist}" var="m">
		<option value="${m.pmId}" ${m.pmId == dto.pmId ? 'selected' : ''}>${m.empName}</option>
	</c:forEach>
</select>
</div>
<div style="display:grid; grid-template-columns:150px 1fr; gap:10px; margin-bottom:15px;">
<label for="taskStartDate" class="form-label">시작일</label>
<input type="date" id="task_start_date" name="taskStartDate" class="form-control" value="${dto.taskStartDate}"/>
</div>
<div style="display:grid; grid-template-columns:150px 1fr; gap:10px; margin-bottom:15px;">
<label for="taskEndDate" class="form-label">종료일</label>
<input type="date" id="task_end_date" name="taskEndDate" class="form-control" value="${dto.taskEndDate}"/>
</div>
<div style="display:grid; grid-template-columns:150px 1fr; gap:10px; margin-bottom:15px;">
  <label for="reg_date" class="form-label">수정일</label>
  <input type="text" id="reg_date" class="form-control" value="<%= today %>" readonly />
</div>
<hr>
<div  class="my-3  text-end"> 
<button type="reset"   class="btn btn-outline-primary"  title="글취소">취소</button>
<a href="${pageContext.request.contextPath}/proj/proj_list"     class="btn btn-outline-success"  title="목록보러가기">목록</a>
<button type="submit"  class="btn btn-primary"  title="등록">등록</button>
</div>
</form>
</div>

<%@include file="/layout/footer.jsp" %>