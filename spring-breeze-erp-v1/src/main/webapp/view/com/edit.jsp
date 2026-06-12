<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="../inc/header.jsp"%>

<div class="container my-5" style="max-width:640px;">
    <%-- 페이지 헤더 --%>
    <div class="d-flex align-items-center gap-2 mb-4">
        <a href="${pageContext.request.contextPath}/com/list.do"
           class="btn btn-sm btn-outline-secondary">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
			  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
			</svg>  
        </a>
        <h5 class="mb-0 fw-semibold">회사 정보 수정</h5>
    </div>

    <div class="card shadow-sm">
        <div class="card-body p-4">
            <form method="post" action="${pageContext.request.contextPath}/com/edit.do">
                <input type="hidden" name="companyId" value="${com.companyId}">
                <%-- 회사명 --%>
                <div class="mb-3">
                    <label for="companyNm" class="form-label fw-medium">
                        회사명 <span class="text-danger">*</span>
                    </label>
                    <input type="text" class="form-control" id="companyNm" name="companyNm"
                           placeholder="회사명을 입력하세요" value="${com.companyNm}" required>
                </div>
                <%-- 사업자번호 (readonly) --%>
                <div class="mb-3">
                    <label for="bizNo" class="form-label fw-medium">사업자번호</label>
                    <div class="input-group">
                        <input type="text" class="form-control bg-light" id="bizNo" name="bizNo"
                               value="${com.bizNo}" readonly>
                    </div>
                    <div class="form-text text-muted">사업자번호는 수정할 수 없습니다.</div>
                </div>
                <%-- 전화번호 --%>
                <div class="mb-3">
                    <label for="tel" class="form-label fw-medium">전화번호</label>
                    <input type="tel" class="form-control" id="tel" name="tel"
                           placeholder="02-0000-0000" value="${com.tel}">
                </div>
                <%-- 주소 --%>
                <div class="mb-3">
                    <label for="address" class="form-label fw-medium">주소</label>
                    <input type="text" class="form-control" id="address" name="address"
                           placeholder="주소를 입력하세요" value="${com.address}">
                </div>
                <%-- 로고 URL --%>
                <div class="mb-4">
                    <label for="logoUrl" class="form-label fw-medium">로고 URL</label>
                    <input type="text" class="form-control" id="logoUrl" name="logoUrl"
                           placeholder="https://example.com/logo.png" value="${com.logoUrl}">
                </div>

                <%-- 버튼 --%>
                <div class="d-flex gap-2 justify-content-end">
                    <button type="reset" class="btn btn-outline-secondary">
                    	초기화
                    </button>
                    <a href="${pageContext.request.contextPath}/com/list.do"
                       class="btn btn-outline-dark">
                       목록
                    </a>
                    <button type="submit" class="btn btn-primary">
                        저장
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<%@include file="../inc/footer.jsp"%>
