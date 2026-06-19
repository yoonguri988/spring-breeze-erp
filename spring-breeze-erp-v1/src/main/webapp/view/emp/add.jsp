<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/layout/header.jsp"%>
<!-- header -->
<!-- header -->


	<section class="container card my-5">
		<h1 class="card-header">사원 등록</h1>
		<p class="text-muted">*표시 항목은 필수 입력입니다.</p>
		<form action="${pageContext.request.contextPath}/emp/add"
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
				<input type="email" class="form-control" id="empEmail" name="empEmail" 
						placeholder="예: name@company.com" />
				<div class="tEmail duplicateChkBox"></div>
			</div>
			
			<div class="my-3">
				<label for="empMobile" class="form-label"> 연락처 *</label>
				<input type="tel" class="form-control" id="empMobile" name="empMobile" 
						placeholder="예: 01012345678" pattern="[0-9{9,11}]" />
				<div class="tMobile duplicateChkBox"></div>
			</div>
			
			<!-- 이메일/연락처 중복 검사 통합 -->
			<script>
			window.addEventListener("load", function(){
			    // 공통 요소
			    const empEmail = document.getElementById("empEmail");
			    const empMobile = document.getElementById("empMobile");
			    const targetEmail = document.querySelector(".tEmail");
			    const targetMobile = document.querySelector(".tMobile");
			    const submitBtn = document.getElementById("submitBtn");
			    
			    // 검증 상태 (둘 다 처음에는 false)
			    let emailOk = false;
			    let mobileOk = false;
			    
			    // Submit 버튼 활성화
			    function updateSubmit() {
			    	
			        submitBtn.disabled = !(emailOk && mobileOk);
			        if(emailOk && mobileOk) {
			        	submitBtn.disabled  
			        	submitBtn.ClassName = "btn btn-primary";
			        } else {
			        	submitBtn.disabled = true;
			        }
			        
			    }
			    
			    // 초기 비활성화
			    updateSubmit();
			    
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
			</script>
			
			<div class="my-3">
				<label for="hireDate" class="form-label"> 입사일 *</label>
				<input type="date" class="form-control" id="hireDate" name="hireDate" required />
			</div>
			
			<div class="my-3 text-end">
				<a href="${pageContext.request.contextPath}/emp/list" class="btn btn-outline-secondary" title="취소">취소</a>
				<button type="submit" class="btn btn-secondary" id="submitBtn" title="등록하기">등록</button>
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