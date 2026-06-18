<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp"%>
<!-- header -->
<!-- header -->


	<section id="profile" class="m-5 p-3">
		<h3 class="blind">상세 조회</h3>
		<div class="card m-3 p-3 d-flex flex-row align-items-center">
			<!-- 유저 이미지 업로드 기능은 나중에 추가 -->
			<div class="my-3 px-3 flex-shrink-0 gap-2">
				<img id="userImg" src="https://picsum.photos/100"
					class="rounded-circle" alt="profile image">
			</div>
			<!-- 사원 정보(간략) -->
			<div class="m-2 p-3 flex-fill">
				<div class="d-flex align-items-center gap-2">
					<p id="userName">${emp.empName}</p>
					<!-- 이름 -->
					<c:choose>
						<c:when test="${emp.empStatus == '재직'}">
							<span class="badge bg-success">재직</span>
						</c:when>
						<c:when test="${emp.empStatus == '휴직'}">
							<span class="badge bg-warning text-dark">휴직</span>
						</c:when>
						<c:when test="${emp.empStatus == '퇴사'}">
							<span class="badge bg-danger">퇴사</span>
						</c:when>
					</c:choose>
				</div>
				<p class="mt-1 userInfo">
					${emp.deptName} · ${emp.posName} · 사번 ${emp.empNo}
				</p>
				<p class="mt-2">
					📧 ${emp.empEmail} · 📱 ${emp.empMobile}
				</p>
			</div>

			<!-- 버튼 -->
			<div class="d-flex flex-column gap-2">
				<a href="${pageContext.request.contextPath}/emp/edit?empId=${emp.empId}" class="btn btn-primary">정보수정</a>
				<a href="${pageContext.request.contextPath}/emp/editpass?empId=${emp.empId}" class="btn btn-light">비밀번호 수정</a>
			</div>
		</div>
		<div class="card m-3 p-3">
			<table class="table">
				<tbody>
					<tr>
						<th>사번</th>
						<td>${emp.empNo}</td>
						<th>이름</th>
						<td>${emp.empName}</td>
						<th>부서</th>
						<td>${emp.deptName}</td>
						<th>직급</th>
						<td>${emp.posName}</td>
					</tr>
					<tr>
						<th>이메일</th>
						<td>${emp.empEmail}</td>
						<th>연락처</th>
						<td>${emp.empMobile}</td>
						<th>입사일</th>
						<td>${emp.hireDate}</td>
						<th>재직상태</th>
						<td>${emp.empStatus}</td>
					</tr>
					<tr>
						<th>등록일</th>
						<td>${emp.createdAt}</td>
						<th>최근 수정일</th>
						<td>${emp.updatedAt}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- 버튼 -->
		<div class="m-3 text-end">
			<a href="${pageContext.request.contextPath}/emp/list" class="btn btn-light">목록으로</a>
			<a href="${pageContext.request.contextPath}/emp/authEdit?empId=${emp.empId}" class="btn btn-danger">권한수정</a>
		</div>
	</section>

<!--  footer -->
<!--  footer -->
<%@include file="/layout/footer.jsp"  %>