<%@page import="java.time.LocalDate"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="/layout/header.jsp" %>

 <div class="container my-5 ms-5">
 <h3 class="card-header">프로젝트 목록</h3>
 <div class="card my-5 p-3">
 <p>상태별 조회</p>
	 <div class="row align-items-center">
		 <div class="col-sm-6">
		 <a href="${pageContext.request.contextPath}/proj/proj_list" class="btn btn-outline-primary">전체</a>
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
 <div class="text-end my-2">
 <a href="${pageContext.request.contextPath}/proj/proj_create" class="btn btn-outline-warning">프로젝트생성</a>
 </div>
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
 		<c:forEach items="${list}" var="dto" varStatus="status">
 		   <tr> 
 		   		<td><a href="${pageContext.request.contextPath}/proj/proj_detail?pro_id=${dto.proId}">${dto.proName}</a></td>
 				<td>${dto.proDesc}</td>
 				<td>${dto.empName}</td>
 				<td><a href="${pageContext.request.contextPath}/proj/proj_member?pro_id=${dto.proId}" class="btn btn-outline-primary btn-sm">멤버</a>   ${dto.memberCnt}명</td>
 				<td><fmt:formatDate value="${dto.startDate}" pattern="yyyy-MM-dd"/>-
 				<fmt:formatDate value="${dto.endDate}" pattern="yyyy-MM-dd"/></td>
 				<td><fmt:formatDate value="${dto.createdAt}" pattern="yyyy-MM-dd"/></td>
 			</tr>
 		</c:forEach>
 	</tbody>
 	 </table>
 </div>
 <tfoot>
 	<tr> <td colspan="5">
 	<ul class="pagination justify-content-center">
 	<c:if test="${paging.start > paging.bottomlist}">
 	<li class="page-item">
 	<a href="?pstartno=${paging.start-1}" class="page-link">이전</a>
 	</li>
 	</c:if>
 	<c:forEach var="i" begin="${paging.start}" end="${paging.end}">
 	<li class="page-item <c:if test="${i==paging.current}"> active</c:if>">
 	<a href="?pstartno=${i}" class="page-link">${i}</a>
 	</li>
 	</c:forEach>
 	<c:if test="${paging.pagetotal > paging.end}">
 	<li class="page-item">
 	<a href="?pstartno=${paging.end+1}" class="page-link">다음</a>
 	</li>
 	</c:if>
 	</ul> </td></tr>
 	</tfoot>

<%@include file="/layout/footer.jsp" %>