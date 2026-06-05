<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>   
<%@include file="../inc/header.jsp"%>
<script>
window.addEventListener("load", function(){
	let msg = "${msg}";
	if(msg != "") alert(msg);
})
</script>
	<div class="container card my-5">
		<h3 class="card-header">company list</h3>
		<div class="mb-3">
			<a class="btn btn-primary"
			   href="${pageContext.request.contextPath}/company/add.do">회사 등록</a>
		</div>
		<div class="mb-3">
			<table class="table table-striped table-hover">
				<thead>
					<tr>
						<th scope="col">번호</th>
						<th scope="col">회사명</th>
						<th scope="col">사업자번호</th>
						<th scope="col">전화번호</th>
						<th scope="col">등록일</th>
						<th scope="col">수정/삭제</th>
					</tr>
				</thead>
				<tbody>
				<c:forEach var="com" items="${items}" varStatus="status">
					<tr>
						<td>${com.companyId }</td>
						<td>${com.companyNm }</td>
						<td>${com.bizNo }</td>
						<td>${com.tel }</td>
						<td>${com.createdAt }</td>
						<td>
							<a class="btn btn-outline-primary" href="${pageContext.request.contextPath }/company/edit.do?companyId=${com.companyId}">수정</a>
							<a class="btn btn-outline-danger" href="${pageContext.request.contextPath }/company/delete.do?companyId=${com.companyId}">삭제</a>
						</td>
					</tr>
				</c:forEach>
				</tbody>
			</table>
		</div>
	</div>
<%@include file="../inc/footer.jsp"%>
