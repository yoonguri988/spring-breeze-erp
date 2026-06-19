<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp"%>
<!-- header -->
<!-- header -->

<section class="emp_edit sb-content">

	<!-- 페이지 헤더 -->
	<div class="sb-page-head">
		<div class="sb-page-head__txt">
			<div class="sb-breadcrumb">
				<a href="${pageContext.request.contextPath}/">홈</a>
				<i class="bi bi-chevron-right"></i>
				<a href="${pageContext.request.contextPath}/emp/list">사원관리</a>
				<i class="bi bi-chevron-right"></i> 정보 수정
			</div>
			<h1>${emp.empName} · 정보 수정</h1>
			<p>사원 정보를 수정합니다.</p>
		</div>
		<div class="sb-page-head__actions">
			<a href="${pageContext.request.contextPath}/emp/detail?empId=${emp.empId}" class="btn btn-ghost btn-sm">
				<i class="bi bi-arrow-left"></i>
				상세 페이지로
			</a>
		</div>
	</div>

	<form action="${pageContext.request.contextPath}/emp/edit" method="post" onsubmit="return checkForm()">
		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
		<input type="hidden" name="empId" value="${emp.empId}" />

		<!-- 기본 정보 -->
		<div class="sb-card mb-3">
			<div class="sb-card__head">
				<h2>
					<i class="bi bi-person me-2 text-soft"></i>
					기본 정보
				</h2>
				<div class="right">
					<span class="sb-badge sb-badge--gray">${emp.empNo}</span>
				</div>
			</div>
			<div class="edInfoBox sb-card__body">
				<div class="row g-3">
					<div class="col-md-6">
						<label for="empNo" class="sb-form-label">사번</label>
						<input type="text" class="form-control rdOnly" id="empNo" name="empNo" value="${emp.empNo}" readonly />
					</div>

					<div class="col-md-6">
						<label for="empName" class="sb-form-label">
							이름 <span>*</span>							
						</label>
						<input type="text" class="form-control" id="empName"
							name="empName" value="${emp.empName}" required />
					</div>

					<div class="col-md-6">
						<label for="deptId" class="sb-form-label">
							부서 <span>*</span>
						</label> <select class="form-select" id="deptId" name="deptId" required>
							<c:forEach var="dept" items="${deptList}">
								<option value="${dept.deptId}"
									<c:if test="${emp.deptId == dept.deptId}">selected</c:if>>
									${dept.deptName}
								</option>
							</c:forEach>
						</select>
					</div>

					<div class="col-md-6">
						<label for="posId" class="sb-form-label"> 직급 <span
							style="color: var(- -sb-red)">*</span>
						</label> <select id="posId" name="posId" class="form-select" required>
							<c:forEach var="pos" items="${posList}">
								<option value="${pos.posId}"
									<c:if test="${emp.posId == pos.posId}">selected</c:if>>
									${pos.posName}
								</option>
							</c:forEach>
						</select>
					</div>

					<div class="col-md-6">
						<label for="empEmail" class="sb-form-label">
							이메일 <span>*</span>
						</label>
						<input type="text" class="form-control" id="empEmail"
							name="empEmail" value="${emp.empEmail}" required />
					</div>

					<div class="col-md-6">
						<label for="empMobile" class="sb-form-label">
							연락처 <span>*</span>
						</label>
						<input type="text" class="form-control" id="empMobile"
							name="empMobile" value="${emp.empMobile}" required />
					</div>

					<div class="col-md-6">
						<label for="hireDate" class="sb-form-label">입사일</label>
						<input type="date" class="form-control rdOnly" id="hireDate" name="hireDate"
							value="${emp.hireDate}" readonly />
					</div>

					<div class="col-md-6">
						<label for="empStatus" class="sb-form-label">
							재직 상태 <span>*</span>
						</label> <select id="empStatus" name="empStatus" class="form-select"
							required>
							<option value="재직"
								<c:if test="${emp.empStatus == '재직'}">selected</c:if>>
								재직
							</option>
							<option value="휴직"
								<c:if test="${emp.empStatus == '휴직'}">selected</c:if>>
								휴직
							</option>
							<option value="퇴사"
								<c:if test="${emp.empStatus == '퇴사'}">selected</c:if>>
								퇴사
							</option>
						</select>
					</div>
				</div>
			</div>
		</div>

		<!-- 버튼 -->
		<div class="d-flex gap-2 justify-content-end">
			<a href="${pageContext.request.contextPath}/emp/list"
				class="btn btn-ghost" title="취소">취소</a>
			<button type="submit" class="btn btn-sb" title="수정">
				<i class="bi bi-check-lg"></i> 변경사항 저장
			</button>
		</div>
	</form>
</section>

<script>
	function checkForm() {
		let empNo = document.getElementById("empNo");
		let empName = document.getElementById("empName");
		let deptId = document.getElementById("deptId");
		let posId = document.getElementById("posId");
		let empEmail = document.getElementById("empEmail");
		let empMobile = document.getElementById("empMobile");
		let hireDate = document.getElementById("hireDate");

		if (empNo.value.trim() == "") {
			empNo.focus();
			return false;
		}
		if (empName.value.trim() == "") {
			empName.focus();
			return false;
		}
		if (deptId.value == "") {
			deptId.focus();
			return false;
		}
		if (posId.value == "") {
			posId.focus();
			return false;
		}
		if (empEmail.value.trim() == "") {
			empEmail.focus();
			return false;
		}
		if (empMobile.value.trim() == "") {
			empMobile.focus();
			return false;
		}
		if (hireDate.value.trim() == "") {
			hireDate.focus();
			return false;
		}
		return true;
	}
</script>


<!--  footer -->
<!--  footer -->
<%@include file="/layout/footer.jsp"%>