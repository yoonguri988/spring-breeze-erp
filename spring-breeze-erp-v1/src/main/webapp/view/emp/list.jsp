<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp"%>
<!-- header -->
<!-- header -->

<section class="emp_sec my-3">
	<!-- 검색 폼 -->
	<!-- 검색 폼 -->
	<div class="container my-3 p-3">
		<form action="${pageContext.request.contextPath}/emp/list" method="get" class="sb-toolbar" >
			<input type="hidden" name="searched" value="1" />
			<div class="sb-field">
				<label for="deptId"  class="blind">부서 선택</label>
				<select class="form-select" id="deptId" name="deptId">
					<option value="">부서</option>
					<c:forEach var="dept" items="${deptList}">
						<option value="${dept.deptId}"
							<c:if test="${search.deptId == dept.deptId}">selected </c:if>>
							${dept.deptName}
						</option>
					</c:forEach>
				</select>
			</div>
			
			<div class="sb-field">
				<label for="posId" class="blind">직급 선택</label>
				<select id="posId" name="posId" class="form-select">
					<option value="">직급</option>
					<c:forEach var="pos" items="${posList}">
						<option value="${pos.posId}"
							<c:if test="${search.posId == pos.posId}">selected</c:if>>
							${pos.posName}
						</option>
					</c:forEach>
				</select>
			</div>
			
			<div class="sb-field">
				<label for="empStatus"  class="blind">상태 선택</label>
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
			
			<div class="sb-field sb-field--search">
				<i class="bi bi-search"></i>
				<input type="text" name="keyword" placeholder="이름 또는 사번" value="${search.keyword}" />
			</div>

			<button type="submit" class="btn btn-primary">검색</button>
			
			<div class="ms-auto">
				<a class="btn btn-primary" href="${pageContext.request.contextPath}/emp/add">
					<i class="bi bi-plus-lg me-1"></i>사원 등록
				</a>
			</div>
		</form>
		<!-- 검색 폼 -->
		<!-- 검색 폼 -->
	</div>
	
	<!-- 검색 결과 -->
	<!-- 검색 결과 -->
	<div class="resultTable">
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
								<td>
									<a href="${pageContext.request.contextPath}/emp/detail?empId=${dto.empId}" 
									title="상세정보 보기" class="btn btn-light"> 
										상세 
									</a>
									<a href="${pageContext.request.contextPath}/emp/edit?empId=${dto.empId}" 
									title="정보 수정하기" class="btn btn-primary">
										수정
									</a>
								</td>
							</tr>
						</c:forEach>
					</tbody>
				</table>
			</c:otherwise>
		</c:choose>
	</div>
	<!-- 검색 결과 -->
	<!-- 검색 결과 -->
	
	<!-- 페이징 -->
	<!-- 페이징 -->
	<c:if test="${paging != null}">
		<div class="my-3">
			<ul class="pagination justify-content-center">
				<!-- 검색 필터 조건 유지: c:set 사용하기, searched 값 차후 comId로 변경 -->
				<c:set var="filter" value="searched=1" />
				<!-- 검색 조건이 있다면(not empty) 변수(filter)에 값 저장 -->
				<c:if test="${not empty search.deptId}">
					<c:set var="filter" value="${filter}&deptId=${search.deptId}" />
				</c:if>
				<c:if test="${not empty search.posId}">
					<c:set var="filter" value="${filter}&posId=${search.posId}" />
				</c:if>
				<c:if test="${not empty search.empStatus}">
					<c:set var="filter" value="${filter}&empStatus=${search.empStatus}" />
				</c:if>
				<c:if test="${not empty search.keyword}">
					<c:set var="filter" value="${filter}&keyword=${search.keyword}" />
				</c:if>
				<!-- 이전 -->
				<c:if test="${paging.current > 1}">
					<li class="page-item">
						<a href="?${filter}&page=${paging.current - 1}" class="page-link">이전</a>
					</li>
				</c:if>
				<!-- 목록 번호 표시 -->
				<c:forEach var="i" begin="${paging.start}" end="${paging.end}">
					<li class="page-item ${paging.current == i? 'active' : ''}">
						<a href="?${filter}&page=${i}" class="page-link">${i}</a>
					</li>
				</c:forEach>
				<!-- 다음 -->
				<c:if test="${paging.current < paging.pagetotal}">
					<li class="page-item">
						<a href="?${filter}&page=${paging.current + 1}" class="page-link">다음</a>
					</li>
				</c:if>
			</ul>
		</div>
	</c:if>
	<!-- 페이징 -->
	<!-- 페이징 -->	
</section>



<!--  footer -->
<!--  footer -->
<%@include file="/layout/footer.jsp"%>