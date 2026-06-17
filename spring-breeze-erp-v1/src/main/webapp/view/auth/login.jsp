<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>로그인 및 본인인증</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container vh-100 d-flex justify-content-center align-items-center">
    <div class="row w-100" style="max-width: 900px;">
        
        <c:if test="${not empty error}">
            <div class="alert alert-danger text-center mb-4" role="alert">${error}</div>
        </c:if>
        <c:if test="${param.resetSuccess eq 'true'}">
            <div class="alert alert-success text-center mb-4" role="alert">비밀번호가 성공적으로 변경되었습니다. 로그인 해주세요.</div>
        </c:if>

        <div class="col-md-6 mb-3">
            <div class="card shadow-sm h-100">
                <div class="card-body p-4">
                    <h3 class="card-title mb-4 font-weight-bold">사원 로그인</h3>
                    <form action="${pageContext.request.contextPath}/auth/login" method="post">
                    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
                        <div class="mb-3">
                            <label for="empEmail" class="form-label">이메일</label>
                            <input type="text" class="form-control" id="empEmail" name="username" required>
                        </div>
                        <div class="mb-4">
                            <label for="password" class="form-label">비밀번호</label>
                            <input type="password" class="form-control" id="empPass" name="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">로그인</button>
                    </form>
                </div>
            </div>
        </div>

        <div class="col-md-6 mb-3">
            <div class="card shadow-sm h-100 border-warning">
                <div class="card-body p-4">
                    <h3 class="card-title mb-4 text-warning">비밀번호 재설정 인증</h3>
                    <p class="text-muted small">비밀번호를 잊으셨나요? 본인 정보를 입력하시면 재설정 페이지로 이동합니다.</p>
                    <form action="/auth/verify-user" method="post">
                        <div class="mb-3">
                            <label for="empNo" class="form-label">사원번호</label>
                            <input type="text" class="form-control" id="empNo" name="empNO" required>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">이메일 주소</label>
                            <input type="email" class="form-control" id="empEmail" name="empEmail" placeholder="example@company.com" required>
                        </div>
                        <div class="mb-4">
                            <label for="empMoblie" class="form-label">휴대폰 번호</label>
                            <input type="text" class="form-control" id="empMoblie" name="empMoblie" placeholder="010-0000-0000" required>
                        </div>
                        <button type="submit" class="btn btn-warning w-100 text-white">본인 인증하기</button>
                    </form>
                </div>
            </div>
        </div>

    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>