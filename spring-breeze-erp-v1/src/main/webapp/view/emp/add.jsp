<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp"%>
<!-- header -->
<!-- header -->

<section class="emp_add sb-content">

	<!-- 페이지 헤더 -->
	<div class="sb-page-head">
		<div class="sb-page-head__txt">
			<div class="sb-breadcrumb">
				<a href="${pageContext.request.contextPath}/">홈</a>
				<i class="bi bi-chevron-right"></i>
				<a href="${pageContext.request.contextPath}/emp/list">사원관리</a>
				<i class="bi bi-chevron-right"></i> 사원 등록
			</div>
			<h1>사원 등록</h1>
			<p>새로운 사원을 등록합니다.</p>
		</div>
		<div class="sb-page-head__actions">
			<a href="${pageContext.request.contextPath}/emp/list" class="btn btn-ghost btn-sm">
				<i class="bi bi-arrow-left"></i>
				목록으로
			</a>
		</div>
	</div>

	<form action="${pageContext.request.contextPath}/emp/add" method="post" onsubmit="return checkForm()">
		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />

		<!-- 기본 정보 -->
		<div class="sb-card mb-3">
			<div class="sb-card__head">
				<h2>
					<i class="bi bi-person me-2 text-soft"></i>기본 정보
				</h2>
			</div>
			<div class="sb-card__body">
				<div class="row g-3">
					<div class="col-md-6">
						<label for="empNo" class="sb-form-label"> 
							사번 <span>*</span>
						</label>
						<input type="text" class="form-control" id="empNo" name="empNo" required />
						<div class="tEmpNo duplicateChkBox"></div>
					</div>

					<div class="col-md-6">
						<label for="empName" class="sb-form-label">
							이름 <span>*</span>
						</label>
						<input type="text" class="form-control" id="empName" name="empName" required />
					</div>

					<div class="col-md-6">
						<label for="deptId" class="sb-form-label">
							부서 <span>*</span>
						</label> <select class="form-select" id="deptId" name="deptId" required>
							<option value="">부서 선택</option>
							<c:forEach var="dept" items="${deptList}">
								<option value="${dept.deptId}">${dept.deptName}</option>
							</c:forEach>
						</select>
					</div>

					<div class="col-md-6">
						<label for="posId" class="sb-form-label">
							직급 <span>*</span>
						</label>
						<select id="posId" name="posId" class="form-select" required>
							<option value="">직급 선택</option>
							<c:forEach var="pos" items="${posList}">
								<option value="${pos.posId}">${pos.posName}</option>
							</c:forEach>
						</select>
					</div>

					<div class="col-md-6">
						<label for="empEmail" class="sb-form-label">
							이메일 <span>*</span>
						</label>
						<input type="email" class="form-control" id="empEmail"
							name="empEmail" placeholder="예: name@company.com" required />
						<div class="tEmail duplicateChkBox"></div>
					</div>

					<div class="col-md-6">
						<label for="empMobile" class="sb-form-label">
							연락처 <span>*</span>
						</label>
						<input type="tel" class="form-control" id="empMobile"
							name="empMobile" pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
							placeholder="예: 010-1234-5678" required />
						<div class="tMobile duplicateChkBox"></div>
					</div>

					<div class="col-md-6">
						<label for="hireDate" class="sb-form-label">
							입사일 <span>*</span>
						</label>
						<input type="date" class="form-control" id="hireDate" name="hireDate" required />
					</div>
				</div>
			</div>
		</div>

		<!-- 버튼 -->
		<div class="d-flex gap-2 justify-content-end">
			<a href="${pageContext.request.contextPath}/emp/list"
				class="btn btn-ghost" title="취소"> 취소 </a>
			<button type="submit" class="btn btn-sb" id="submitBtn" title="등록하기">
				등록
			</button>
		</div>

	</form>
</section>


<script>

	// 사번/이메일/연락처 중복 검사 통합
	window.addEventListener("load", function(){
	    const empNo = document.getElementById("empNo");
	    const empEmail = document.getElementById("empEmail");
	    const empMobile = document.getElementById("empMobile");
	    const targetEmpNo = document.querySelector(".tEmpNo");
	    const targetEmail = document.querySelector(".tEmail");
	    const targetMobile = document.querySelector(".tMobile");
	    const submitBtn = document.getElementById("submitBtn");
	    
	    // 검증 상태 (둘 다 처음에는 false)
	    let emailOk = false;
	    let mobileOk = false;
	    let empNoOk = false;
	 
		 // Submit 버튼 활성화
	    function updateSubmit() {
	        if(empNoOk && emailOk && mobileOk) {
	        	submitBtn.disabled = false;
	        	submitBtn.className = "btn btn-primary";
	        } else { 
	        	submitBtn.disabled = true;
	        	submitBtn.className = "btn btn-sb";
	        }
	    }
		 
	 	// 초기 비활성화
	    updateSubmit();
	    		 
		// 사번 검증
		empNo.addEventListener("blur", function(e){
			let value = e.target.value.trim();
			
			if(value === ""){
				targetEmpNo.textContent = "사번을 입력하세요.";
				targetEmpNo.className = "tEmpNo duplicateChkBox sb-badge--amber";
	            empNoOk = false;
	            updateSubmit();
	            return;
	        }
			
			fetch("${pageContext.request.contextPath}/emp/checkEmpNo?empNo=" + encodeURIComponent(value))
	        .then(res => res.json())
	        .then(data => {
	            if(data.duplicate){
	            	targetEmpNo.textContent = "이미 사용중인 사번입니다.";
	            	targetEmpNo.className = "tEmpNo duplicateChkBox sb-badge--red";
	            	empNoOk = false;
	            } else {
	            	targetEmpNo.textContent = "사용 가능한 사번입니다.";
	            	targetEmpNo.className = "tEmpNo duplicateChkBox sb-badge--green";
	            	empNoOk = true;
	            }
	            updateSubmit();
	        })
	        .catch(err => {
	        	targetEmpNo.textContent = "서버 오류입니다.";
	        	targetEmpNo.className = "tEmpNo duplicateChkBox sb-badge--cyan";
	        	empNoOk = false;
	            updateSubmit();
	        });
		});
	    
	    // 이메일 검증
	    empEmail.addEventListener("blur", function(e){
	        let value = e.target.value.trim();
	        
	        if(value === ""){
	            targetEmail.textContent = "이메일을 입력하세요.";
	            targetEmail.className = "tEmail duplicateChkBox sb-badge--amber";
	            emailOk = false;
	            updateSubmit();
	            return;
	        }
	        
	        if(!empEmail.validity.valid){
	            targetEmail.textContent = "올바른 이메일 형식이 아닙니다.";
	            targetEmail.className = "tEmail duplicateChkBox sb-badge--gray";
	            emailOk = false;
	            updateSubmit();
	            return;
	        }
	        
	        fetch("${pageContext.request.contextPath}/emp/checkEmail?empEmail=" + encodeURIComponent(value))
	        .then(res => res.json())
	        .then(data => {
	            if(data.duplicate){
	                targetEmail.textContent = "이미 사용중인 이메일입니다.";
	                targetEmail.className = "tEmail duplicateChkBox sb-badge--red";
	                emailOk = false;
	            } else {
	                targetEmail.textContent = "사용 가능한 이메일입니다.";
	                targetEmail.className = "tEmail duplicateChkBox sb-badge--green";
	                emailOk = true;
	            }
	            updateSubmit();
	        })
	        .catch(err => {
	            targetEmail.textContent = "서버 오류입니다.";
	            targetEmail.className = "tEmail duplicateChkBox sb-badge--cyan";
	            emailOk = false;
	            updateSubmit();
	        });
	    });
	    
	    // 연락처 검증
	    empMobile.addEventListener("blur", function(e){
	        let value = e.target.value.trim();
	        
	        if(value === ""){
	            targetMobile.textContent = "연락처를 입력하세요.";
	            targetMobile.className = "tMobile duplicateChkBox sb-badge--amber";
	            mobileOk = false;
	            updateSubmit();
	            return;
	        }
	        
	        if(!empMobile.validity.valid){
	            targetMobile.textContent = "올바른 연락처 형식이 아닙니다.";
	            targetMobile.className = "tMobile duplicateChkBox sb-badge--gray";
	            mobileOk = false;
	            updateSubmit();
	            return;
	        }
	        
	        fetch("${pageContext.request.contextPath}/emp/checkMobile?empMobile=" + encodeURIComponent(value))
	        .then(res => res.json())
	        .then(data => {
	            if(data.duplicate){
	                targetMobile.textContent = "이미 사용중인 연락처입니다.";
	                targetMobile.className = "tMobile duplicateChkBox sb-badge--red";
	                mobileOk = false;
	            } else {
	                targetMobile.textContent = "사용 가능한 연락처입니다.";
	                targetMobile.className = "tMobile duplicateChkBox sb-badge--green";
	                mobileOk = true;
	            }
	            updateSubmit();
	        })
	        .catch(err => {
	            targetMobile.textContent = "서버 오류입니다.";
	            targetMobile.className = "tMobile duplicateChkBox sb-badge--cyan";
	            mobileOk = false;
	            updateSubmit();
	        });
	    });
	});

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
<%@include file="/layout/footer.jsp"%>