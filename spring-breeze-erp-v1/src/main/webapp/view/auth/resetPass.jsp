<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>비밀번호 재설정</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container vh-100 d-flex justify-content-center align-items-center">
    <div class="card shadow" style="width: 100%; max-width: 450px;">
        <div class="card-body p-4">
            <h3 class="card-title text-center mb-4">새 비밀번호 설정</h3>
            
            <c:if test="${not empty error}">
                <div class="alert alert-danger text-center small" role="alert">${error}</div>
            </c:if>

            <form action="/auth/resetPass" method="post" id="resetForm">
				<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />    
                <div class="mb-3">
                    <label for="newPassword" class="form-label">새 비밀번호</label>
                    <input type="password" class="form-control" id="newPassword" name="newPassword" required>
                </div>
                <div class="mb-4">
                    <label for="confirmPassword" class="form-label">새 비밀번호 확인</label>
                    <input type="password" class="form-control" id="confirmPassword" required>
                    <div class="invalid-feedback" id="passwordError">비밀번호가 일치하지 않습니다.</div>
                </div>
                <button type="submit" class="btn btn-success w-100">비밀번호 변경 완료</button>
            </form>
        </div>
    </div>
</div>

<script>
    // 비밀번호 일치 여부 체크 스크립트
    document.getElementById('resetForm').addEventListener('submit', function(event) {
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmInput = document.getElementById('confirmPassword');

        if (password !== confirmPassword) {
            event.preventDefault(); // 폼 제출 막기
            confirmInput.classList.add('is-invalid'); // Bootstrap 에러 스타일 적용
            document.getElementById('passwordError').style.display = 'block';
        } else {
            confirmInput.classList.remove('is-invalid');
        }
    });
</script>
</body>
</html>