<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp"%>
<!-- header -->
<!-- header -->


	<section class="container card my-5">
		<h1 class="card-header">사원 등록</h1>
		<p class="text-muted">*표시 항목은 필수 입력입니다.</p>
		<form action="${pageContext.request.contextPath}/emp/join"
			method="post" onsubmit="return checkForm()">
			<input  type="hidden" name="${_csrf.parameterName}"  value="${_csrf.token}" />
			<div class="my-3">
				<label for="empNo" class="form-label"> 사번 *</label>
				<input type="text" class="form-control" id="empNo" name="empNo" required />
			</div>
			<div class="my-3">
				<label for="empName" class="form-label"> 이름 *</label>
				<input type="text" class="form-control" id="empName" name="empName" required />
			</div>
			<div class="my-3">
				<label for="deptId">부서</label>
				<select class="form-select" id="deptId" name="deptId" required >
					<option value="">부서 선택</option>
					<c:forEach var="dept" items="${deptList}">
						<option value="${dept.deptId}">${dept.deptName}</option>
					</c:forEach>
				</select>
			</div>
			
			<div class="my-3">
				<label for="posId">직급</label>
				<select id="posId" name="posId" class="form-select" required >
					<option value="">직급 선택</option>
					<c:forEach var="pos" items="${posList}">
						<option value="${pos.posId}"> ${pos.posName} </option>
					</c:forEach>
				</select>
			</div>
			
			<div class="my-3">
				<label for="empEmail" class="form-label"> 이메일 *</label>
				<input type="text" class="form-control" id="empEmail" name="empEmail" required />
				<p class="target blind"> 이메일 중복 검사</p>
			</div>
			<script>
				window.addEventListener("load", function(){
					let empEmail = document.getElementById("empEmail");
					let target = document.querySelector(".target");
					
					empEmail.addEventListener("keyup", funtion(e){
						let value = e.target.value.trim(); 
						if(value !== ""){
							fetch("/doubleEmail?empEmail=" + encodeURIComponent(value))
							.then( res => res.json() )
							.then(data => {
								if(data.exists){
									target.textContent= "이미 사용중인 이메일입니다.";
									target.className = "target alert alert-danger";
								} else {
									target.textContent= "사용 가능한 이메일입니다.";
									target.className = "target alert alert-success";
								}
							})
							.catch(err => {
								target.textContent= "서버 오류입니다.";
								target.className = "target alert alert-info";
							});
						} else {
							target.textContent= "이메일을 입력하세요.";
							target.className = "target alert alert-light";
						}
					});
				});
			</script>
			
			<div class="my-3">
				<label for="empMobile" class="form-label"> 연락처 *</label>
				<input type="text" class="form-control" id="empMobile" name="empMobile" required />
			</div>
			
			<div class="my-3">
				<label for="hireDate" class="form-label"> 입사일 *</label>
				<input type="date" class="form-control" id="hireDate" name="hireDate" required />
			</div>
			
			<div class="my-3 text-end">
				<a href="${pageContext.request.contextPath}/emp/list" class="btn btn-outline-secondary" title="취소">취소</a>
				<button type="submit" class="btn btn-primary" title="등록">등록</button>
			</div>
		</form>
	</section>

	<script>
	function   checkForm(){
		let empNo = document.getElementById("empNo");
		let empName = document.getElementById("empName");
		let deptId = document.getElementById("deptId");
		let posId = document.getElementById("posId");
		let empEmail = document.getElementById("empEmail");
		let empMobile = document.getElementById("empMobile");
		let hireDate = document.getElementById("hireDate");
		
		if(empNo.value.trim() ==""){ empNo.focus();  return false; }
		if(empName.value.trim() ==""){ empName.focus();  return false; }
		if(deptId.value ==""){ deptId.focus();  return false; }
		if(posId.value ==""){ posId.focus();  return false; }
		if(empEmail.value.trim() ==""){ empEmail.focus();  return false; }
		if(empMobile.value.trim() ==""){ empMobile.focus();  return false; }
		if(hireDate.value.trim() ==""){ hireDate.focus();  return false; }
		return true;
	}
	</script>

<!--  footer -->
<!--  footer -->
<%@include file="/layout/footer.jsp"  %>