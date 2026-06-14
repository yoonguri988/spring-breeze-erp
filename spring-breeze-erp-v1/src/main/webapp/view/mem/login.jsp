<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>   
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <!-- Latest compiled and minified CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Latest compiled JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <link href="./css/board.css" rel="stylesheet">
</head>
<body>
	<div class="container my-5">
	<h3>로그인</h3>
	
		<form action="${pageContext.request.contextPath}/" method="post" onsubmit="return checkForm()">
		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
			<div class="my-3">
				<label for="user_email" class="form-label">이메일</label>
				<input type="email" class="form-control" id="user_email" name="username" />
			</div>
			
			<div class="my-3">
				<label for="user_pass" class="form-label">비밀번호</label>
				<input type="password" class="form-control" id="user_pass" name="password" />
			</div>
			
			<div class="text-end">
				<button type="reset" class="btn btn-outline-primary">취소</button>
				<button type="submit" class="btn btn-primary">로그인</button>
			</div>
		</form>
	</div>
</body>
</html>