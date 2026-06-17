<%@page import="java.time.LocalDate"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="/layout/header.jsp" %>

 <div class="container my-5 ms-5">
 <h3 class="card-header">프로젝트 목록</h3>
 <div class="card my-5 p-3">
 <p>상태별 조회</p>
	 <div class="row align-items-center">
		 <div class="col-sm-6">
		 <a href="${pageContext.request.contextPath}/proj/proj_list.do" class="btn btn-outline-primary">전체</a>
		 <a href="${pageContext.request.contextPath}/proj/status?pro_status=TODO" class="btn btn-outline-secondary">TODO</a>
		 <a href="${pageContext.request.contextPath}/proj/status?pro_status=DOING" class="btn btn-outline-danger">DOING</a>
		 <a href="${pageContext.request.contextPath}/proj/status?pro_status=DONE" class="btn btn-outline-info">DONE</a>
		 </div>
		 <div class="col-sm-6 text-end">
		 <label for="pro_name" class="form-label"></label>
		 <input type="text" id="pro_name" name="pro_name" class="form-control d-inline-block w-auto" placeholder="프로젝트명 검색"/>
		 <button type="button" id="searchBtn" class="btn btn-primary">조회</button>
		 </div>
	 </div>
 </div>
 <a href="${pageContext.request.contextPath}/proj/proj_create.do" class="btn btn-info">프로젝트생성</a>
 <table class="table table-striped table-bordered table-hover">
 	<caption></caption>
 	<thead>
 	<tr>
 		<th scope="col">프로젝트명</th>
 		<th scope="col">설명</th>
 		<th scope="col">생성자</th>
 		<th scope="col">참여인원</th>
 		<th scope="col">기간</th>
 		<th scope="col">등록일</th>
 	</tr>
 	</thead>
 	<tbody>
 		<c:forEach items="${list}" var="dto">
 			<tr>
 				<td>${dto.pro_name}</td>
 				<td>${dto.pro_desc}</td>
 				<td>${dto.emp_name}</td>
 				<td><a href="" class="btn btn-outline-primary">멤버</a></td>
 				<td>${dto.start_date}-${dto.end_date}</td>
 				<td>${dto.created_at}</td>
 			</tr>
 		</c:forEach>
 	
 
 	</tbody>
 
 </table>
 
 
 </div>
<%@include file="/layout/footer.jsp" %>