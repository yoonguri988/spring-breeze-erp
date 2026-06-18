<%@page import="java.time.LocalDate"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="/layout/header.jsp" %>

<div class="container my-5 ms-5">
<p>홈 > 프로젝트 > 프로젝트 멤버관리</p>
<h3>프로젝트 멤버관리</h3>
<div class="text-end">
<form action="${pageContext.request.contextPath}/proj/proj_member_create" method="post">
<input type="hidden" name="projectProId" value="${pro_id}">
<input type="hidden" name="${_csrf.parameterName}"  value="${_csrf.token}" />
<button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">추가</button>
<a href="${pageContext.request.contextPath}/proj/proj_list" class="btn btn-outline-info">목록</a>

<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title fs-5" id="exampleModalLabel">멤버추가</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body text-start">
          <div class="mb-3">
            <label for="recipient-name" class="col-form-label">사원번호</label>
            <input type="text" class="form-control" id="recipient-name" name="empId" value="${dto.empId}" />
          </div>
          <div class="mb-3">
            <label for="message-text" class="col-form-label">사원이름</label>
            <textarea class="form-control" name="empName" id="message-text">${dto.empName}</textarea>
          </div>
            <div class="mb-3">
            <label for="message-text" class="col-form-label">역할</label>
            <textarea class="form-control" name="role" id="message-text">${dto.role}</textarea>
          </div>
          </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
        <button type="submit" class="btn btn-info">추가</button>
      </div>
    </div>
  </div>
</div>
  </form>
</div>
 <div class="card my-5 p-3">
  <table class="table table-striped table-bordered table-hover">
   <thead>
   <tr>
   	<th scope="col">프로젝트명</th>
   	<th scope="col">사원</th>
   	<th scope="col">역할</th>
   	<th scope="col">등록일</th>
   	<th scope="col">삭제</th>
   </tr>
   </thead>
   <tbody>
   <c:forEach items="${list}" var="dto" varStatus="status">
   	<tr>
   	<td>${dto.proName}</td>
   	<td>${dto.empName}</td>
   	<td>${dto.role}</td>
   	<td><fmt:formatDate value="${dto.joinedAt}" pattern="yyyy-MM-dd"/></td>
   	<td><a href="${pageContext.request.contextPath}/proj/proj_member_delete?pm_id=${dto.pmId}&pro_id=${pro_id}" class="btn btn-danger">삭제</a></td>
   	</tr>
   	</c:forEach>
   </tbody>
  </table>
 </div>
</div>    

    
<%@include file="/layout/footer.jsp" %>