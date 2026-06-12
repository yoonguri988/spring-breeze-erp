<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="../inc/header.jsp"%>
<div class="container my-5" style="max-width:640px;">
    <%-- 페이지 헤더 --%>
    <div class="d-flex align-items-center gap-2 mb-4">
        <a href="${pageContext.request.contextPath}/company/list.do"
           class="btn btn-sm btn-outline-secondary">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
			  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
			</svg>        
		</a>
        <h5 class="mb-0 fw-semibold">회사 등록</h5>
    </div>

    <div class="card shadow-sm">
        <div class="card-body p-4">
            <form method="post"
                  action="${pageContext.request.contextPath}/company/add.do"
                  onsubmit="return validateForm()">
                <%-- 회사명 --%>
                <div class="mb-3">
                    <label for="companyNm" class="form-label fw-medium">
                        회사명 <span class="text-danger">*</span>
                    </label>
                    <input type="text" class="form-control" id="companyNm" name="companyNm"
                           placeholder="회사명을 입력하세요" value="${com.companyNm}">
                    <div class="invalid-feedback"></div>
                </div>
                <%-- 사업자번호 --%>
                <div class="mb-3">
                    <label for="bizNo" class="form-label fw-medium">
                        사업자번호 <span class="text-danger">*</span>
                    </label>
                    <div class="input-group has-validation">
                        <input type="text" class="form-control" id="bizNo" name="bizNo"
                               placeholder="000-00-00000"
                               onblur="checkBizNo()"
                               value="${com.bizNo}">
                        <span class="input-group-text" id="bizNoSpinner" style="display:none;">
                            <span class="spinner-border spinner-border-sm text-secondary"></span>
                        </span>
                        <div class="invalid-feedback"></div>
                        <div class="valid-feedback">사용 가능한 사업자번호입니다.</div>
                    </div>
                    <div class="form-text text-muted">형식: 123-45-67890</div>
                </div>
                <%-- 전화번호 --%>
                <div class="mb-3">
                    <label for="tel" class="form-label fw-medium">전화번호</label>
                    <input type="tel" class="form-control" id="tel" name="tel"
                           placeholder="02-0000-0000" value="${com.tel}">
                </div>
                <%-- 주소 --%>
                <div class="mb-4">
                    <label for="address" class="form-label fw-medium">주소</label>
                    <input type="text" class="form-control" id="address" name="address"
                           placeholder="주소를 입력하세요" value="${com.address}">
                </div>
                <%-- 버튼 --%>
                <div class="d-flex gap-2 justify-content-end">
                    <button type="reset" class="btn btn-outline-secondary">초기화</button>
                    <a href="${pageContext.request.contextPath}/company/list.do"
                       class="btn btn-outline-dark">목록</a>
                    <button type="submit" class="btn btn-primary">등록</button>
                </div>

            </form>
        </div>
    </div>
</div>

<script>
/* ── 폼 제출 유효성 검사 ── */
function validateForm() {
    let valid = true;

    // 회사명
    const companyNmInput = document.getElementById("companyNm");
    if (!companyNmInput.value.trim()) {
        setInvalid(companyNmInput, "회사명은 필수입니다.");
        valid = false;
    } else {
        setValid(companyNmInput);
    }

    // 사업자번호 형식 + 중복 판정 여부
    const bizNoInput   = document.getElementById("bizNo");
    const bizNoPattern = /^\d{3}-\d{2}-\d{5}$/;
    if (!bizNoPattern.test(bizNoInput.value.trim())) {
        setInvalid(bizNoInput, "사업자번호 형식이 올바르지 않습니다.");
        valid = false;
    } else if (bizNoInput.classList.contains("is-invalid")) {
        valid = false; // blur 시 이미 중복 판정
    }

    return valid;
}

/* ── 사업자번호 중복 체크 (onblur) ── */
function checkBizNo() {
    const bizNoInput   = document.getElementById("bizNo");
    const spinner      = document.getElementById("bizNoSpinner");
    const bizNo        = bizNoInput.value.trim();
    const bizNoPattern = /^\d{3}-\d{2}-\d{5}$/;

    if (!bizNoPattern.test(bizNo)) {
        setInvalid(bizNoInput, "사업자번호 형식이 올바르지 않습니다. (예: 123-45-67890)");
        return;
    }

    // 스피너 표시
    spinner.style.display = "";
    bizNoInput.classList.remove("is-valid", "is-invalid");

    fetch("${pageContext.request.contextPath}/company/checkBizNo.do?bizNo=" + encodeURIComponent(bizNo))
        .then(res => res.json())
        .then(data => {
            spinner.style.display = "none";
            if (data[0] != null) {
                setInvalid(bizNoInput, "이미 사용 중인 사업자번호입니다.");
            } else {
                setValid(bizNoInput);
            }
        })
        .catch(() => {
            spinner.style.display = "none";
            console.error("중복 체크 중 오류가 발생했습니다.");
        });
}

/* ── 공통 헬퍼 ── */
function setInvalid(input, message) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    const fb = input.parentElement.querySelector(".invalid-feedback")
            || input.nextElementSibling;
    if (fb && fb.classList.contains("invalid-feedback")) fb.textContent = message;
}

function setValid(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
}
</script>

<%@include file="../inc/footer.jsp"%>
