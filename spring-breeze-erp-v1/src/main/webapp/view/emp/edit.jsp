<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp"%>
<!-- header -->
<!-- header -->


	<section class="container card my-5">
		<h1 class="card-header">정보 수정</h1>
		<p class="text-muted">*표시 항목은 필수 입력입니다.</p>
		<form action="${pageContext.request.contextPath}/emp/edit"
			method="post" onsubmit="return checkForm()">
			<input type="hidden" name="${_csrf.parameterName}"
				value="${_csrf.token}" /> <input type="hidden" name="empId"
				value="${emp.empId}">
			<div class="my-3">
				<label for="empNo" class="form-label"> 사번 *</label> <input
					type="text" class="form-control" id="empNo" name="empNo"
					value="${emp.empNo}" readonly />
			</div>
			<div class="my-3">
				<label for="empName" class="form-label"> 이름 *</label> <input
					type="text" class="form-control" id="empName" name="empName"
					value="${emp.empName}" />
			</div>
			<div class="my-3">
				<label for="deptId">부서</label> <select class="form-select"
					id="deptId" name="deptId" required>
					<c:forEach var="dept" items="${deptList}">
						<option value="${dept.deptId}"
							<c:if test="${emp.deptId == dept.deptId}">selected</c:if>>
							${dept.deptName}</option>
					</c:forEach>
				</select>
			</div>
			<div class="my-3">
				<label for="posId">직급</label> <select id="posId" name="posId"
					class="form-select" required>
					<c:forEach var="pos" items="${posList}">
						<option value="${pos.posId}"
							<c:if test="${emp.posId == pos.posId}">selected</c:if>>
							${pos.posName}</option>
					</c:forEach>
				</select>
			</div>
			<div class="my-3">
				<label for="empEmail" class="form-label"> 이메일 *</label>
				<input type="text" class="form-control" id="empEmail" name="empEmail" value="${emp.empEmail}" required />
			</div>
			<div class="my-3">
				<label for="empMobile" class="form-label"> 연락처 *</label>
				<input type="text" class="form-control" id="empMobile" name="empMobile" value="${emp.empMobile}" required />
			</div>
			<div class="my-3">
				<label for="hireDate" class="form-label"> 입사일 *</label>
				<input type="date" class="form-control" id="hireDate" name="hireDate" readonly value="${emp.hireDate}" />
			</div>
			<div class="my-3">
				<label for="empStatus">재직 상태</label>
					<select id="empStatus" name="empStatus" class="form-select" required>
					<option value="재직" <c:if test="${emp.empStatus == '재직'}">selected</c:if>>재직</option>
					<option value="휴직" <c:if test="${emp.empStatus == '휴직'}">selected</c:if>>휴직</option>
					<option value="퇴사" <c:if test="${emp.empStatus == '퇴사'}">selected</c:if>>퇴사</option>
				</select>
			</div>
			<div class="my-3 text-end">
				<a href="${pageContext.request.contextPath}/emp/list"
					class="btn btn-outline-secondary" title="취소">취소</a>
				<button type="submit" class="btn btn-primary" title="수정">수정</button>
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
<%@include file="/layout/footer.jsp"  %>