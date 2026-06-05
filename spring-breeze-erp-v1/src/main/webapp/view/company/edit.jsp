<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>   
<%@include file="../inc/header.jsp"%>
<script>
</script>
	<div class="container card my-5">
		<h3 class="card-header">company edit</h3>
		<form class=""  method="post" >
			<div class="mb-3">
				<label for="companyNm" class="form-label">회사명</label>
				<input type="text" class="form-control" id="companyNm" name="companyNm" placeholder="회사명" value="${com.companyNm}">
			</div>
			<div class="mb-3">
				<label for="bizNo" class="form-label">사업자번호</label>
				<input type="text" class="form-control" id="bizNo" name="bizNo" placeholder="사업자번호" value="${com.bizNo}" readonly>
			</div>
			<div class="mb-3">
				<label for="tel" class="form-label">전화번호</label>
				<input type="tel" class="form-control" id="tel" name="tel" placeholder="전화번호" value="${com.tel}">
			</div>
			<div class="mb-3">
				<label for="address" class="form-label">주소</label>
				<input type="text" class="form-control" id="address" name="address" placeholder="주소" value="${com.address}">
			</div>
			<div class="mb-3">
				<label for="logoUrl" class="form-label">로고 URL</label>
				<input type="text" class="form-control" id="logoUrl" name="logoUrl" placeholder="로고 URL" value="${com.logoUrl}">
			</div>
			<div class="mb-3">
				<button type="submit" class="btn btn-primary">등록</button>
				<a href="${pageContext.request.contextPath }/company/list.do" class="btn btn-info">목록</a>
				<button type="reset" class="btn btn-danger">취소</button>
			</div>
		</form>
	</div>
<%@include file="../inc/footer.jsp"%>
