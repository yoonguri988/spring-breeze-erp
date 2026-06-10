<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@include file="../inc/header.jsp"%>

<div class="container my-5" style="max-width:640px;">

    <%-- 페이지 헤더 --%>
    <div class="d-flex align-items-center gap-2 mb-4">
        <a href="${pageContext.request.contextPath}/dept/list.do?companyId=${dto.companyId}"
           class="btn btn-sm btn-outline-secondary">
            <i class="bi bi-chevron-left"></i>
        </a>
        <h5 class="mb-0 fw-semibold">
            <i class="bi bi-pencil-square me-1 text-primary"></i> 부서 수정
        </h5>
    </div>

    <div class="card shadow-sm">
        <div class="card-body p-4">
            <form method="post"
                  action="${pageContext.request.contextPath}/dept/edit.do"
                  novalidate id="deptForm">
                <input type="hidden" name="deptId"    value="${dto.deptId}">
                <input type="hidden" name="companyId" value="${dto.companyId}">

                <%-- 부서명 --%>
                <div class="mb-3">
                    <label for="deptNm" class="form-label fw-medium">
                        부서명 <span class="text-danger">*</span>
                    </label>
                    <input type="text" id="deptNm" name="deptNm" class="form-control"
                           placeholder="예) 개발팀" value="${dto.deptNm}" required>
                    <div class="invalid-feedback">부서명은 필수 입력 항목입니다.</div>
                </div>

                <%-- 부서코드 --%>
                <div class="mb-3">
                    <label for="deptCd" class="form-label fw-medium">
                        부서코드 <span class="text-danger">*</span>
                    </label>
                    <input type="text" id="deptCd" name="deptCd" class="form-control"
                           placeholder="예) COM-DEV" value="${dto.deptCd}" required>
                    <div class="invalid-feedback">부서코드는 필수 입력 항목입니다.</div>
                </div>

                <%-- 상위 부서 --%>
                <div class="mb-4">
                    <label for="parentId" class="form-label fw-medium">상위 부서</label>
                    <select id="parentId" name="parentId" class="form-select">
                        <option value="0">— 최상위 부서 (없음)</option>
                        <c:forEach var="dept" items="${items}">
                            <option value="${dept.deptId}"
                                <c:if test="${dept.deptId == dto.parentId}">selected</c:if>>
                                <c:forEach begin="1" end="${dept.depth}" var="i">&#160;&#160;&#160;</c:forEach>
                                <c:if test="${dept.depth > 0}">└&#160;</c:if>${dept.deptNm}<c:if test="${not empty dept.deptCd}"> (${dept.deptCd})</c:if>
                            </option>
                        </c:forEach>
                    </select>
                    <div class="form-text">
                        <i class="bi bi-info-circle me-1"></i>
                        계층 구조는 들여쓰기(└)로 표시됩니다. 선택하지 않으면 최상위로 등록됩니다.
                    </div>
                </div>

                <%-- 버튼 --%>
                <div class="d-flex gap-2 justify-content-end">
                    <button type="reset" class="btn btn-outline-secondary">
                        <i class="bi bi-arrow-counterclockwise me-1"></i> 초기화
                    </button>
                    <a href="${pageContext.request.contextPath}/dept/list.do?companyId=${dto.companyId}"
                       class="btn btn-outline-dark">
                        <i class="bi bi-list me-1"></i> 목록
                    </a>
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-floppy me-1"></i> 저장
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
document.getElementById("deptForm").addEventListener("submit", function (e) {
    if (!this.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
    }
    this.classList.add("was-validated");
});
</script>

<%@include file="../inc/footer.jsp"%>
