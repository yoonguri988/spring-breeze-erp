<%@page import="java.time.LocalDate"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp" %>

<%String today = LocalDate.now().toString(); %>
	<div class="container my-5 ms-5">
		<p>홈 > 프로젝트 > 프로젝트 수정</p>
		<h3 class="card-header">프로젝트 수정</h3>
		<hr>
		<form action="${pageContext.request.contextPath}/proj/proj_edit" method="post" onsubmit="check()">
		<input  type="hidden" name="${_csrf.parameterName}"  value="${_csrf.token}" />
		<input type="hidden" name="proId" value="${dto.proId}">
		<div class="my-4"style="display:grid; grid-template-columns:150px 1fr; gap:10px; margin-bottom:15px;">
		<label for="proName" class="form-label mb-3">프로젝트명</label>
		<input type="text" id="pro_name" name="proName" class="form-control" value="${dto.proName}"/>
		</div>
		<div style="display:grid; grid-template-columns:150px 1fr; gap:10px; margin-bottom:15px;">
		<label for="proDesc" class="form-label">프로젝트 설명</label>
		<input id="pro_desc" name="proDesc" class="form-control p-5" value="${dto.proDesc}"/>
		</div>
		<div style="display:grid; grid-template-columns:150px 1fr; gap:10px; margin-bottom:15px;">
		<label for="proStatus" class="form-label">상태</label>
		<select id="pro_status" name="proStatus" class="form-select">
		    <option value="" disabled selected>상태를 입력하세요</option>
			<option value="TODO">TODO</option>
			<option value="DOING">DOING</option>
			<option value="DONE">DONE</option>
		</select>
		</div>
		<div style="display:grid; grid-template-columns:150px 1fr; gap:10px; margin-bottom:15px;">
		<label for="startDate" class="form-label">시작일</label>
		<input type="date" id="start_date" name="startDate" class="form-control" 
		value="<fmt:formatDate value="${dto.startDate}" pattern="yyyy-MM-dd"/>"/>
		</div>
		<div style="display:grid; grid-template-columns:150px 1fr; gap:10px; margin-bottom:15px;">
		<label for="endDate" class="form-label">종료일</label>
		<input type="date" id="end_date" name="endDate" class="form-control"
		value="<fmt:formatDate value="${dto.endDate}" pattern="yyyy-MM-dd"/>"/>
		</div>
		<div style="display:grid; grid-template-columns:150px 1fr; gap:10px; margin-bottom:15px;">
		  <label for="updatedAt" class="form-label">수정일</label>
		  <input type="text" id="updated_at" class="form-control" value="${dto.updatedAt}" pattern="yyyy-MM-dd" readonly/>
		</div>
		    <div  class="my-3  text-end"> 
      		<button type="reset"   class="btn btn-outline-primary"  title="글수정취소">취소</button>
      		<a href="${pageContext.request.contextPath}/proj/proj_list" class="btn btn-outline-success"  title="목록보러가기">목록</a>
      		<button type="submit"  class="btn btn-primary"  title="글수정">수정</button>
      	</div>
		</form>
	</div>
	<script>
	
	</script>
<%@include file="/layout/footer.jsp" %>