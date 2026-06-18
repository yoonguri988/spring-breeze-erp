<%@page import="java.time.LocalDate"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp" %>

<div class="container my-5 ms-5">
<p>홈 > 프로젝트 > 프로젝트 상세</p>
<h3>프로젝트 상세조회</h3>
<div class="text-end">
<a href="${pageContext.request.contextPath}/proj/proj_edit?pro_id=${dto.proId}" class="btn btn-outline-primary">수정</a>
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
        <a href="${pageContext.request.contextPath}/proj/delete?pro_id=${dto.proId}" class="btn btn-danger">
        삭제
        </a>
      </div>
    </div>
  </div>
</div>
</div>
<div class="row my-5">
<div class="col-md-7">
<div class="card">
<div class="card-header text-primary bg-white fw-bold">기본정보</div>
  <table class="table table-bordered">
      <tr>
        <th class="w-25">프로젝트명</th>
        <td>${dto.proName}</td></tr><tr>
        <th>설명</th>
        <td>${dto.proDesc}</td></tr><tr>
        <th>상태</th>
        <td>${dto.proStatus}</td></tr><tr>
        <th>생성자</th>
        <td>${dto.empName}</td></tr><tr>
        <th>시작일</th>
        <td>${dto.startDate}</td></tr><tr>
        <th>종료일</th>
        <td>${dto.endDate}</td></tr><tr>
        <th>등록일</th>
        <td>${dto.createdAt}</td></tr><tr>
      </tr>
  </table>
</div>
</div>
<div class="col-md-5">
<div class="card">
<div class="card-header bg-white d-flex justify-content-between align-items-center">
<span>태스크목록</span>
<a href="" class="btn btn-primary btn-sm">태스크추가</a>
</div>
<table class="table table-bordered">
<thead>
<tr>
<th>번호</th>
<th>업무명</th>
<th>상태</th>
<th>등록일</th>
</tr>
</thead>
<tbody>
<tr>
<%-- <td>${dto.taskId}</td>
<td>${dto.taskName}</td>
<td>${dto.taskStatus}</td>
<td>${dto.taskId}</td> --%>
</tr>
</tbody>
</table>
</div>
</div>
</div>

</div>


<%@include file="/layout/footer.jsp" %>