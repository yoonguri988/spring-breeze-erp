<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp"%>
<!-- header -->
<!-- header -->

<section class="emp_detail sb-content">

	<!-- 페이지 헤더 -->
	<div class="sb-page-head">
		<div class="sb-page-head__txt">
			<div class="sb-breadcrumb">
				<a href="${pageContext.request.contextPath}/">홈</a>
				<i class="bi bi-chevron-right"></i>
				<a href="${pageContext.request.contextPath}/emp/list">사원관리</a>
				<i class="bi bi-chevron-right"></i> 상세정보
			</div>
			<h1>${emp.empName}</h1>
			<p>${emp.deptName} · ${emp.posName}</p>
		</div>
		<div class="sb-page-head__actions">
			<a href="${pageContext.request.contextPath}/emp/list" class="btn btn-ghost btn-sm">
				<i class="bi bi-arrow-left"> </i>
				목록으로
			</a>
		</div>
	</div>

	<!-- 프로필 카드 -->
	<div class="sb-card mb-3">
		<div class="profileBox sb-card__body">
			<!-- 아바타 + 이름 -->
			<div class="d-flex align-items-center gap-3">
				<div class="sb-avatar">
					${fn:substring(emp.empName, 0, 1)}
				</div>
				<div class="sumInfoBox1">
					<p class="prfSumInfo">${emp.empName}</p>
					<p class="prfSumInfo">${emp.deptName} · ${emp.posName}</p>
					<div class="prfBadgeBox mt-1">
						<span class="sb-badge sb-badge--gray">${emp.empNo}</span>
						<c:choose>
							<c:when test="${emp.empStatus == '재직'}">
								<span class="sb-badge sb-badge--green ms-1">
								<span class="pip"></span>재직</span>
							</c:when>
							<c:when test="${emp.empStatus == '휴직'}">
								<span class="sb-badge sb-badge--amber ms-1">
								<span class="pip"></span>휴직</span>
							</c:when>
							<c:when test="${emp.empStatus == '퇴직'}">
								<span class="sb-badge sb-badge--red ms-1">
								<span class="pip"></span>퇴직</span>
							</c:when>
						</c:choose>
					</div>
				</div>
			</div>

			<div class="vr d-none d-md-block"></div>

			<div class="sumInfoBox2">
				<div>
					<p class="text-faint">이메일</p>
					<p>${emp.empEmail}</p>
				</div>
				<div>
					<p class="text-faint">연락처</p>
					<p>${emp.empMobile}</p>
				</div>
				<div>
					<p class="text-faint">입사일</p>
					<p>${emp.hireDate}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- 상세 정보 카드 -->
	<div class="detInfoBox sb-card mb-3">
		<div class="sb-card__head">
			<h2>
				<i class="bi bi-person-lines-fill me-2 text-soft"></i>상세 정보
			</h2>
		</div>
		<div class="sb-card__body">
			<div class="row g-3">
				<div class="col-md-3">
					<div class="text-faint">사번</div>
					<p>${emp.empNo}</p>
				</div>
				<div class="col-md-3">
					<div class="text-faint">이름</div>
					<p>${emp.empName}</p>
				</div>
				<div class="col-md-3">
					<div class="text-faint">부서</div>
					<p>${emp.deptName}</p>
				</div>
				<div class="col-md-3">
					<div class="text-faint">직급</div>
					<p>${emp.posName}</p>
				</div>
				<div class="col-md-3">
					<div class="text-faint">이메일</div>
					<p>${emp.empEmail}</p>
				</div>
				<div class="col-md-3">
					<div class="text-faint">연락처</div>
					<p>${emp.empMobile}</p>
				</div>
				<div class="col-md-3">
					<div class="text-faint">입사일</div>
					<p class="tnum">${emp.hireDate}</p>
				</div>
				<div class="col-md-3">
					<div class="text-faint">재직상태</div>
					<div>
						<c:choose>
							<c:when test="${emp.empStatus == '재직'}">
								<span class="sb-badge sb-badge--green"><span class="pip"></span>재직</span>
							</c:when>
							<c:when test="${emp.empStatus == '휴직'}">
								<span class="sb-badge sb-badge--amber"><span class="pip"></span>휴직</span>
							</c:when>
							<c:when test="${emp.empStatus == '퇴직'}">
								<span class="sb-badge sb-badge--red"><span class="pip"></span>퇴직</span>
							</c:when>
						</c:choose>
					</div>
				</div>
				<div class="col-md-3">
					<div class="text-faint">
						등록일
					</div>
					<p class="tnum">
						${emp.createdAt}
					</p>
				</div>
				<div class="col-md-3">
					<div class="text-faint">
						최근 수정일
					</div>
					<p class="tnum">
						${emp.updatedAt}
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- 하단 버튼 -->
	<div class="d-flex gap-2 justify-content-end">
		<a href="${pageContext.request.contextPath}/emp/authEdit?empId=${emp.empId}" class="btn btn-ghost btn-sm">
			<i class="bi bi-shield-lock"></i>
			권한 수정
		</a>
		<!-- 비밀번호 초기화 : 관리자 전용/차후 권한 변경 -->
		<a
			href="${pageContext.request.contextPath}/emp/resetPass?empId=${emp.empId}"
			class="btn btn-ghost btn-sm"> <i class="bi bi-key"></i> 비밀번호 초기화
		</a>
		<!-- 비밀번호 수정 : 본인만 -->
		<c:if test="${loginEmpId == emp.empId}">
			<a
				href="${pageContext.request.contextPath}/emp/editPass?empId=${emp.empId}"
				class="btn btn-ghost btn-sm"> <i class="bi bi-key"></i> 비밀번호 수정
			</a>
		</c:if>
		<a
			href="${pageContext.request.contextPath}/emp/edit?empId=${emp.empId}"
			class="btn btn-sb btn-sm"> <i class="bi bi-pencil"></i> 정보 수정
		</a>
	</div>
</section>

<!--  footer -->
<!--  footer -->
<%@include file="/layout/footer.jsp"%>