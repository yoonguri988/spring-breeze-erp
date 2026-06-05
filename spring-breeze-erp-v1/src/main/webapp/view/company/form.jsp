<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>   
<%@include file="../inc/header.jsp"%>
	<div class="container card my-5">
		<h3 class="card-header">company form</h3>
		<form class=""  method="post" onsubmit="return validateForm()">
			<div class="mb-3">
				<label for="companyNm" class="form-label">회사명</label>
				<input type="text" class="form-control" id="companyNm" name="companyNm" placeholder="회사명" value="${com.companyNm}">
			</div>
			<div class="mb-3">
			<!-- 사업자 번호의 유효성 검사 필요 -->
				<label for="bizNo" class="form-label">사업자번호</label>
				<!-- onblur : 입력창에서 포커스가 벗어났을때 실행 -->
				<input type="text" class="form-control" id="bizNo" name="bizNo" placeholder="사업자번호" onblur="checkBizNo()" value="${com.bizNo}">
			</div>
			<div class="mb-3">
				<label for="tel" class="form-label">전화번호</label>
				<input type="tel" class="form-control" id="tel" name="tel" placeholder="전화번호" value="${com.tel}">
			</div>
			<div class="mb-3">
				<label for="address" class="form-label">주소</label>
				<input type="text" class="form-control" id="address" name="address" placeholder="주소" value="${com.address}">
			</div>
			<div class="mb-3">
			<button type="submit" class="btn btn-primary">등록</button>
			<a href="${pageContext.request.contextPath }/company/list.do" class="btn btn-info">목록</a>
			<button type="reset" class="btn btn-danger">취소</button>
			</div>
		</form>
	</div>
<script>
	// 제출 버튼 유효성 검증
	function validateForm(){
	    let valid = true;

	    // 회사명 검사
	    let companyNmInput = document.getElementById("companyNm");
	    if (!companyNmInput.value.trim()) {
	        setInvalid(companyNmInput, "회사명은 필수입니다.");
	        valid = false;
	    } else {
	        setValid(companyNmInput);
	    }

	    // 사업자번호 형식 + is-invalid 여부 검사
	    let bizNoInput = document.getElementById("bizNo");
	    let bizNoPattern = /^\d{3}-\d{2}-\d{5}$/;
	    if (!bizNoPattern.test(bizNoInput.value.trim())) {
	        setInvalid(bizNoInput, "사업자번호 형식이 올바르지 않습니다.");
	        valid = false;
	    } else if (bizNoInput.classList.contains("is-invalid")) {
	        // blur 시 이미 중복으로 판정된 경우
	        valid = false;
	    }

	    return valid; // false면 submit 막힘
	}
	
	function checkBizNo() {
	    let bizNoInput = document.getElementById("bizNo");
	    let bizNo = bizNoInput.value.trim();
		
	    // 형식 검사: 000-00-00000
	    let bizNoPattern = /^\d{3}-\d{2}-\d{5}$/;
	    if (!bizNoPattern.test(bizNo)) {
	        setInvalid(bizNoInput, "사업자번호 형식이 올바르지 않습니다. (예: 123-45-67890)");
	        return;
	    }
	    
	    // 서버에 중복 체크 요청
	    fetch('/company/checkBizNo.do?bizNo=' + encodeURIComponent(bizNo))
	        .then(response => response.json())
	        .then(data => {
	            if (data.duplicate) {
	                setInvalid(bizNoInput, "이미 사용 중인 사업자번호입니다.");
	            } else {
	                setValid(bizNoInput);
	            }
	        })
	        .catch(error => {
	            console.error("중복 체크 오류:", error);
	        });
	}
	    
	
	function setInvalid(input, message) {
	    input.classList.remove("is-valid");
	    input.classList.add("is-invalid");

	    // 기존 안내 문구 제거 후 새로 추가
	    let feedback = input.nextElementSibling;
	    if (!feedback || !feedback.classList.contains("invalid-feedback")) {
	        feedback = document.createElement("div");
	        feedback.classList.add("invalid-feedback");
	        input.insertAdjacentElement("afterend", feedback);
	    }
	    feedback.textContent = message;
	}

	function setValid(input) {
	    input.classList.remove("is-invalid");
	    input.classList.add("is-valid");

	    // 안내 문구 제거
	    let feedback = input.nextElementSibling;
	    if (feedback && feedback.classList.contains("invalid-feedback")) {
	        feedback.remove();
	    }
	}
</script>
<%@include file="../inc/footer.jsp"%>
