<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp"%>
<!-- header -->
<!-- header -->


<section class="container card my-3">
	<div class="container card my-3 p-3">
		<form action="${pageContext.request.contextPath}/emp/list"
			method="get" class="row g-2 align-items-end">
			<input type="hidden" name="searched" value="1" />
			<div class="col-auto">
				<label for="deptId">부서 선택</label> <select class="form-select"
					id="deptId" name="deptId">
					<option value="">부서</option>
					<c:forEach var="dept" items="${deptList}">
						<option value="${dept.deptId}"
							<c:if test="${search.deptId == dept.deptId}">selected </c:if>>
							${dept.deptName}</option>
					</c:forEach>
				</select>
			</div>
			<div class="col-auto">
				<label for="posId">직급 선택</label>
					<select id="posId" name="posId" class="form-select">
					<option value="">직급</option>
					<c:forEach var="pos" items="${posList}">
						<option value="${pos.posId}"
							<c:if test="${search.posId == pos.posId}">selected</c:if>>
							${pos.posName}</option>
					</c:forEach>
				</select>
			</div>
			<div class="col-auto">
				<label for="empStatus">상태 선택</label>
				<select id="empStatus" name="empStatus" class="form-select">
					<option value="">상태</option>
					<option value="재직"
						<c:if test="${search.empStatus =='재직'}">selected</c:if>>재직</option>
					<option value="휴직"
						<c:if test="${search.empStatus =='휴직'}">selected</c:if>>휴직</option>
					<option value="퇴사"
						<c:if test="${search.empStatus =='퇴사'}">selected</c:if>>퇴사</option>
				</select>
			</div>
			<div class="col">
				<input class="form-control" type="text" name="keyword"
					placeholder="이름 또는 사번 입력" value="${search.keyword}" />
			</div>
			<div class="col-auto">
				<button class="btn btn-primary">검색</button>
			</div>
			<div class="col-auto ms-auto">
				<a class="btn btn-primary"
					href="${pageContext.request.contextPath}/emp/add"> + 사원 등록 </a>
			</div>
		</form>

	</div>
	<div class="my-3">
		<c:choose>
			<c:when test="${empList == null}">
				<p>검색 조건을 설정하고 검색 버튼을 눌러주세요.</p>
			</c:when>
			<c:when test="${empty empList}">
				<p>검색 결과가 없습니다.</p>
			</c:when>
			<c:otherwise>
				<table class="table">
					<thead>
						<tr>
							<th>사번</th>
							<th>이름</th>
							<th>부서</th>
							<th>직급</th>
							<th>이메일</th>
							<th>연락처</th>
							<th>재직상태</th>
							<th>입사일</th>
							<th>관리</th>
						</tr>
					</thead>
					<tbody>
						<c:forEach var="dto" items="${empList}" varStatus="status">
							<tr>
								<td>${dto.empNo}</td>
								<td>${dto.empName}</td>
								<td>${dto.deptName}</td>
								<td>${dto.posName}</td>
								<td>${dto.empEmail}</td>
								<td>${dto.empMobile}</td>
								<td>${dto.empStatus}</td>
								<td>${dto.hireDate}</td>
								<td><a
									href="${pageContext.request.contextPath}/emp/detail?empId=${dto.empId}"
									title="상세정보 보기" class="btn btn-light">상세</a> <a
									href="${pageContext.request.contextPath}/emp/edit?empId=${dto.empId}"
									title="정보 수정하기" class="btn btn-primary">수정</a></td>
							</tr>
						</c:forEach>
					</tbody>
				</table>
			</c:otherwise>
		</c:choose>

	</div>
	<div class="container card my-3">
		<!-- 페이징 기능 추가 -->
	</div>
</section>

<!--  footer -->
<!--  footer -->
<%@include file="/layout/footer.jsp"%>