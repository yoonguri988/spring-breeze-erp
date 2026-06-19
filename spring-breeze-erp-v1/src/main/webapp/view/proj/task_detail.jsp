<%@page import="java.time.LocalDate"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp" %>

<div class="container my-5 ms-5">
<p>홈 > 프로젝트 > 프로젝트 상세 > 태스크 상세</p>
<h3>태스크 상세조회</h3>
<input type="hidden" name="taskId" value="${dto.taskId}">
<input type="hidden" name="projectProId" value="${pro_id}">
<!-- 모달 -->
<div class="text-end">
<a href="${pageContext.request.contextPath}/proj/task_edit?task_id=${dto.taskId}&project_pro_id=${pro_id}" class="btn btn-outline-primary">수정</a>
<button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#exampleModal"> 삭제 </button>
<a href="${pageContext.request.contextPath}/proj/proj_list" class="btn btn-outline-info">목록</a>
<!-- Modal -->
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
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
        <a href="${pageContext.request.contextPath}/proj/task_delete?task_id=${dto.taskId}&pro_id=${pro_id}" class="btn btn-danger"> 삭제 </a>
      </div>
    </div>
  </div>
</div>
</div>
<!-- 모달 끝 -->
<div class="card">
<div class="card-header text-primary bg-white fw-bold">태스크 상세조회</div>
<table class="table table-bordered">
<tr>
<th class="w-25">태스크명</th>
<td>${dto.taskName}</td></tr><tr>
<th class="w-25">태스크설명</th>
<td>${dto.taskDesc}</td></tr><tr>
<th class="w-25">태스크상태</th>
<td>${dto.taskStatus}</td></tr><tr>
<th class="w-25">담당자이름</th>
<td>${dto.pmIdName}</td></tr><tr>
<th class="w-25">태스크시작일</th>
<td>${dto.taskStartDate}</td></tr><tr>
<th class="w-25">태스크종료일</th>
<td>${dto.taskEndDate}</td></tr><tr>
</tr>
</table>
</div>
</div>




<%@include file="/layout/footer.jsp" %>