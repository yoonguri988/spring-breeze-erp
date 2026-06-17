<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>로그인 · SBerp</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/pretendard.min.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/app.css">
</head>
<body>
<div class="container-fluid vh-100">
  <div class="row h-100">

    <!-- 좌측 브랜드 패널 -->
    <div class="col-lg-5 d-none d-lg-flex flex-column text-white p-5"
         style="background:linear-gradient(150deg, var(--sb-accent-hover) 0%, var(--sb-accent) 60%, #4f7cf0 100%)">
      <div class="d-flex align-items-center gap-2">
        <div class="bg-white bg-opacity-25 border border-light rounded-3 d-flex align-items-center justify-content-center fw-bold fs-4" style="width:44px;height:44px">S</div>
        <span class="fs-4 fw-bold">SBerp</span>
      </div>
      <div class="my-auto py-5">
        <h1 class="fw-750 mb-3">전사 통합 ERP,<br>하나의 플랫폼으로</h1>
        <p class="opacity-75 mb-4">인사·조직 관리부터 전자문서 결재,<br>프로젝트·자원예약까지 모두 한 곳에서</p>
        <div class="d-flex flex-column gap-2">
          <div class="bg-white bg-opacity-10 border border-light border-opacity-25 rounded-3 px-3 py-2">
            <i class="bi bi-file-earmark-check-fill me-2"></i>전자문서 · 결재 관리
          </div>
          <div class="bg-white bg-opacity-10 border border-light border-opacity-25 rounded-3 px-3 py-2">
            <i class="bi bi-people-fill me-2"></i>인사 · 조직 · 권한 관리
          </div>
          <div class="bg-white bg-opacity-10 border border-light border-opacity-25 rounded-3 px-3 py-2">
            <i class="bi bi-kanban-fill me-2"></i>프로젝트 · 태스크 관리
          </div>
          <div class="bg-white bg-opacity-10 border border-light border-opacity-25 rounded-3 px-3 py-2">
            <i class="bi bi-calendar2-check-fill me-2"></i>자원 · 공간 예약 관리
          </div>
        </div>
      </div>
      <div class="opacity-50 small">&copy; 2026 SBerp &middot; All rights reserved.</div>
    </div>

    <!-- 우측 로그인 폼 -->
    <div class="col-lg-7 d-flex align-items-center justify-content-center p-4" style="background:var(--sb-bg)">
      <div class="card border-0 shadow-sm w-100" style="max-width:412px">
      <div class="card-body p-4 p-md-5">

        <!-- 비밀번호 재설정 완료 배너 -->
        <c:if test="${param.reset == '1'}">
          <div class="alert alert-success d-flex align-items-center gap-2" role="alert">
            <i class="bi bi-check-circle-fill fs-5"></i>
            <div>
              <div class="fw-bold">비밀번호가 성공적으로 변경되었습니다</div>
              <div class="small">새 비밀번호로 다시 로그인하세요.</div>
            </div>
          </div>
        </c:if>

        <!-- 회원가입 완료 배너 -->
        <c:if test="${param.joined == '1'}">
          <div class="alert alert-success d-flex align-items-center gap-2" role="alert">
            <i class="bi bi-check-circle-fill fs-5"></i>
            <div>
              <div class="fw-bold">회원가입이 완료되었습니다</div>
              <div class="small">발급받은 이메일과 비밀번호로 로그인하세요.</div>
            </div>
          </div>
        </c:if>

        <h1 class="fw-750 mb-1">안녕하세요 👋</h1>
        <p class="text-soft mb-4">이메일과 비밀번호를 입력하여<br>SBerp에 로그인하세요.</p>

        <form id="fmLogin" method="post" action="${pageContext.request.contextPath}/login" novalidate autocomplete="on">

          <div class="mb-3">
            <label for="iEmail" class="sb-form-label">이메일</label>
            <div class="input-group">
              <input type="email" class="form-control ${not empty error ? 'is-invalid' : ''}" id="iEmail" name="email"
                value="${fn:escapeXml(param.email)}" placeholder="name@sberp.co.kr"
                autocomplete="username" required>
              <span class="input-group-text"><i class="bi bi-envelope text-faint"></i></span>
            </div>
          </div>

          <div class="mb-2">
            <div class="d-flex justify-content-between align-items-center">
              <label for="iPw" class="sb-form-label mb-1">비밀번호</label>
              <a href="${pageContext.request.contextPath}/password/forgot" class="small fw-semibold">비밀번호를 잊으셨나요?</a>
            </div>
            <div class="input-group">
              <input type="password" class="form-control ${not empty error ? 'is-invalid' : ''}" id="iPw" name="password"
                placeholder="비밀번호 입력" autocomplete="current-password" required>
              <span class="input-group-text cursor-pointer" id="togglePw" role="button"><i class="bi bi-eye text-faint"></i></span>
            </div>
          </div>

          <div class="form-check mb-3">
            <input class="form-check-input sb-checkbox" type="checkbox" id="rememberMe" name="rememberMe">
            <label class="form-check-label small text-soft" for="rememberMe">로그인 상태 유지</label>
          </div>

          <c:if test="${not empty error}">
            <div class="alert alert-danger d-flex align-items-start gap-2 py-2">
              <i class="bi bi-exclamation-triangle-fill mt-1"></i>
              <span>${fn:escapeXml(error)}</span>
            </div>
          </c:if>

          <button type="submit" class="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2" id="btnLogin">
            <i class="bi bi-box-arrow-in-right"></i><span>로그인</span>
          </button>
        </form>

      </div>
      </div>
    </div>

  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script>
(function () {
  'use strict';

  /* ---- 비밀번호 표시/숨기기 ---- */
  document.getElementById('togglePw').addEventListener('click', function () {
    var inp = document.getElementById('iPw');
    var icon = this.querySelector('i');
    var show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    icon.className = show ? 'bi bi-eye-slash' : 'bi bi-eye';
  });

  /* ---- 제출 시 로딩 표시 (서버에 그대로 POST) ---- */
  document.getElementById('fmLogin').addEventListener('submit', function () {
    var btn = document.getElementById('btnLogin');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span><span>확인 중…</span>';
  });

})();
</script>
</body>
</html>
