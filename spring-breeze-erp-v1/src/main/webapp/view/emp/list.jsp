<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp"%>
<!-- header -->
<!-- header -->

<section class="emp_list sb-content">

	<!-- 페이지 헤더 -->
	<div class="sb-page-head">
		<div class="sb-page-head__txt">
			<div class="sb-breadcrumb">
				<a href="${pageContext.request.contextPath}/">홈</a>
				<i class="bi bi-chevron-right"></i> 조직 관리
				<i class="bi bi-chevron-right"></i> 사원관리
			</div>
			<h1>사원관리</h1>
			<p>전체 임직원 정보를 조회하고 관리합니다.</p>
		</div>
		<div class="sb-page-head__actions">
			<a class="btn btn-sb btn-sm"
				href="${pageContext.request.contextPath}/emp/add">
				<i class="bi bi-person-plus"></i> 사원 등록
			</a>
		</div>
	</div>
	<!-- 페이지 헤더 -->

	<!-- 목록 카드 -->
	<div class="sb-card">

		<!-- 검색 툴바 -->
		<form action="${pageContext.request.contextPath}/emp/list" method="get" class="sb-toolbar">
			<input type="hidden" name="searched" value="1" />

			<div class="sb-field">
				<label for="deptId" class="blind">부서 선택</label>
				<select id="deptId" name="deptId">
					<option value="">전체 부서</option>
					<c:forEach var="dept" items="${deptList}">
						<option value="${dept.deptId}"
							<c:if test="${search.deptId == dept.deptId}">selected</c:if>>
							${dept.deptName}
						</option>
					</c:forEach>
				</select>
			</div>

			<div class="sb-field">
				<label for="posId" class="blind">직급 선택</label>
				<select id="posId" name="posId">
					<option value="">전체 직급</option>
					<c:forEach var="pos" items="${posList}">
						<option value="${pos.posId}"
							<c:if test="${search.posId == pos.posId}">selected</c:if>>
							${pos.posName}
						</option>
					</c:forEach>
				</select>
			</div>

			<div class="sb-field">
				<label for="empStatus" class="blind">상태 선택</label>
				<select id="empStatus" name="empStatus">
					<option value="">전체 상태</option>
					<option value="재직"  <c:if test="${search.empStatus == '재직'}">selected</c:if>>재직</option>
					<option value="휴직"  <c:if test="${search.empStatus == '휴직'}">selected</c:if>>휴직</option>
					<option value="퇴직"  <c:if test="${search.empStatus == '퇴직'}">selected</c:if>>퇴직</option>
				</select>
			</div>

			<div class="sb-field sb-field--search">
				<i class="bi bi-search"></i>
				<input type="text" name="keyword" placeholder="이름 또는 사번" value="${search.keyword}" />
			</div>

			<button type="submit" class="btn btn-sb btn-sm">검색</button>
		</form>

		<!-- 검색 결과 테이블 -->
		<c:choose>
			<c:when test="${empList == null}">
				<div class="sb-empty">
					<i class="bi bi-search"></i>
					<p>검색 조건을 설정하고 검색 버튼을 눌러주세요.</p>
				</div>
			</c:when>
			<c:when test="${empty empList}">
				<div class="sb-empty">
					<i class="bi bi-search"></i>
					<p>검색 결과가 없습니다.</p>
				</div>
			</c:when>
			<c:otherwise>
				<div class="sb-card__body--flush">
					<table class="empListTable sb-table">
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
								<th></th>
							</tr>
						</thead>
						<tbody>
							<c:forEach var="dto" items="${empList}">
								<tr>
									<td class="sb-hr-cell tnum">${dto.empNo}</td>
									<td>
										<div class="sb-rowuser">
											<div class="sb-avatar">${fn:substring(dto.empName, 0, 1)}</div>
											<div>
												<div class="sb-table__name">${dto.empName}</div>
											</div>
										</div>
									</td>
									<td>${dto.deptName}</td>
									<td>${dto.posName}</td>
									<td class="sb-hr-cell">${dto.empEmail}</td>
									<td class="sb-hr-cell">${dto.empMobile}</td>
									<td>
										<c:choose>
											<c:when test="${dto.empStatus == '재직'}">
												<span class="sb-badge sb-badge--green">
													<span class="pip"></span>재직
												</span>
											</c:when>
											<c:when test="${dto.empStatus == '휴직'}">
												<span class="sb-badge sb-badge--amber">
													<span class="pip"></span>휴직
												</span>
											</c:when>
											<c:when test="${dto.empStatus == '퇴직'}">
												<span class="sb-badge sb-badge--red">
													<span class="pip"></span>퇴직</span>
											</c:when>
											<c:otherwise>
												<span class="sb-badge sb-badge--gray">${dto.empStatus}</span>
											</c:otherwise>
										</c:choose>
									</td>
									<td class="sb-hr-cell tnum">${dto.hireDate}</td>
									<td class="num">
										<div class="d-flex justify-content-end gap-1">
											<a href="${pageContext.request.contextPath}/emp/detail?empId=${dto.empId}"
											   class="sb-iconbtn" style="width:30px;height:30px;font-size:14px" title="상세보기">
												<i class="bi bi-eye"></i>
											</a>
											<a href="${pageContext.request.contextPath}/emp/edit?empId=${dto.empId}"
											   class="sb-iconbtn" style="width:30px;height:30px;font-size:14px" title="정보 수정">
												<i class="bi bi-pencil"></i>
											</a>
										</div>
									</td>
								</tr>
							</c:forEach>
						</tbody>
					</table>
				</div>
			</c:otherwise>
		</c:choose>

		<!-- 페이징 -->
		<c:if test="${paging.listtotal > 0}">
			<div class="d-flex align-items-center justify-content-between px-3 py-2"
			     style="border-top:1px solid var(--sb-border)">
				<span class="text-faint" style="font-size:12.5px">
					총 <b>${paging.listtotal}</b>명
				</span>
				<nav>
					<ul class="pagination pagination-sm mb-0">
						<!-- 검색 필터 조건 유지 -->
						<c:set var="filter" value="searched=1" />
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
						<c:if test="${paging.pagetotal > 1}">
							<li class="page-item ${!(paging.start > 1) ? 'disabled' : ''}">
								<a href="?${filter}&pstartno=${paging.start - 1}" class="page-link">
									<i class="bi bi-chevron-left"></i>
								</a>
							</li>
						<!-- 1~10 -->
						<c:forEach var="i" begin="${paging.start}" end="${paging.end}">
							<li class="page-item ${paging.current == i ? 'active' : ''}">
								<a href="?${filter}&pstartno=${i}" class="page-link">${i}</a>
							</li>
						</c:forEach>
						<!-- 다음 -->
						<li class="page-item ${!(paging.end < paging.pagetotal) ? 'disabled' : ''}">
							<a href="?${filter}&pstartno=${paging.end + 1}" class="page-link">
								<i class="bi bi-chevron-right"></i>
							</a>
						</li>
			            </c:if>
					</ul>
				</nav>
			</div>
		</c:if>
	</div>
</section>



<!--  footer -->
<!--  footer -->
<%@include file="/layout/footer.jsp"%>