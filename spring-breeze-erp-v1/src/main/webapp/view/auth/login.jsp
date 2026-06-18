<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="_csrf" content="${_csrf.token}">
<meta name="_csrf_header" content="${_csrf.headerName}">
<title>로그인 · SBerp</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/pretendard.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/app.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/auth.css">
</head>
<body>
<body class="login-page">
	<div class="aw">
		<!-- 왼쪽 브랜드 패널 -->
		<aside class="ab">
			<div class="ab-logo">
				<div class="ab-mark">S</div>
				<span class="ab-name">SBerp</span>
			</div>
			<div class="ab-mid">
				<div class="ab-tagline">전사 통합 ERP,<br>하나의 플랫폼으로</div>
				<div class="ab-tagline-sub">인사·조직 관리부터 전자문서 결재,<br>프로젝트·자원예약까지 모두 한 곳에서</div>
				<div class="ab-feats">
					<div class="ab-feat">
						<i class="bi bi-file-earmark-check-fill"></i><span>전자문서 · 결재 관리</span>
					</div>
					<div class="ab-feat">
						<i class="bi bi-people-fill"></i><span>인사 · 조직 · 권한 관리</span>
					</div>
					<div class="ab-feat">
						<i class="bi bi-kanban-fill"></i><span>프로젝트 · 태스크 관리</span>
					</div>
					<div class="ab-feat">
						<i class="bi bi-calendar2-check-fill"></i><span>자원 · 공간 예약관리</span>
					</div>
				</div>
			</div>
			<div class="ab-foot">© 2026 SBerp · All rights reserved.</div>
		</aside>
		<!-- 왼쪽 브랜드 패널 -->

		<!-- 오른쪽 로그인 폼 -->
		<main class="ap">
			<div class="ap-wrap">
				<!-- section: 로그인 -->
				<div class="asec on" id="secLogin">
					<h1 class="a-h">안녕하세요 👋</h1>
					<p class="a-sub">이메일과 비밀번호를 입력하여<br>SBerp에 로그인하세요.</p>
					<form action="${pageContext.request.contextPath}/auth/login" method="post" id="fmLogin" novalidate autocomplete="on">
						<input  type="hidden" name="${_csrf.parameterName}"  value="${_csrf.token}" />
						<label class="fl" for="iEmail">이메일 주소</label>
						<div class="fw">
							<input class="fi" type="email" id="iEmail"
								placeholder="name@smartbuilder.com" name="username"
								autocomplete="email" spellcheck="false">
							<i class="bi bi-envelope f-icon"></i>
						</div>
						<div class="fe" id="eEmail">
							<i class="bi bi-exclamation-circle"></i><span></span>
						</div>
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px">
							<label class="fl" for="iPw" style="margin: 0">비밀번호</label>
						</div>
						<div class="fw">
							<input class="fi" type="password" id="iPw"
								placeholder="비밀번호 입력" name="password" autocomplete="current-password"> 
								<i class="bi bi-eye f-icon clickable" id="togglePw" title="표시/숨기기"></i>
						</div>
						<div class="fe" id="ePw">
							<i class="bi bi-exclamation-circle"></i><span></span>
						</div>

						<!-- <label style="display:flex;align-items:center;gap:8px;margin-bottom:22px;cursor:pointer">
	            <input type="checkbox" style="width:15px;height:15px;accent-color:var(--sb-accent)">
	            <span style="font-size:13.5px;color:var(--sb-ink-soft)">로그인 상태 유지</span>
	          </label> -->

						<div class="a-alert" id="alertLogin">
							<i class="bi bi-exclamation-triangle-fill"></i> <span
								id="alertLoginTxt"></span>
						</div>

  					    <button type="button" class="a-link" id="toForgot">비밀번호를 잊으셨나요?</button>
						<button type="submit" class="a-btn" id="btnLogin">
							<i class="bi bi-box-arrow-in-right"></i><span>로그인</span>
						</button>
					</form>

					<div class="a-demo">
						<p>
							<i class="bi bi-info-circle"></i> 데모 계정<br> 
							이메일 <code>admin@smartbuilder.com</code>
						  / 비밀번호 <code>1234</code>
						</p>
					</div>
				</div>

				<!-- section: 비밀번호 찾기 -->
				<div class="asec" id="secForgot">
					<button type="button" class="a-back" id="backToLogin">
						<i class="bi bi-arrow-left"></i> 로그인으로 돌아가기
					</button>
					<h1 class="a-h">비밀번호 찾기</h1>
					<p class="a-sub">
						사원번호 · 이메일 · 휴대폰 번호가<br>등록된 정보와 일치하면 재설정 페이지로 이동합니다.
					</p>

					<form id="fmForgot" novalidate>
						<label class="fl" for="empNo">사원번호</label>
						<div class="fw">
							<input class="fi" type="text" id="empNo" placeholder="E1001"
								spellcheck="false" name="empNo" autocapitalize="characters">
							<i class="bi bi-person f-icon"></i>
						</div>

						<label class="fl" for="empEmail">이메일 주소</label>
						<div class="fw">
							<input class="fi" type="email" id="empEmail"
								placeholder="name@sberp.co.kr" name="empEmail"> <i
								class="bi bi-envelope f-icon"></i>
						</div>

						<label class="fl" for="empMobile">휴대폰 번호</label>
						<div class="fw">
							<input class="fi" type="tel" id="empMobile" name="empMobile"
								placeholder="010-0000-0000"> <i
								class="bi bi-phone f-icon"></i>
						</div>

						<div class="a-alert" id="alertForgot">
							<i class="bi bi-exclamation-triangle-fill"></i> <span
								id="alertForgotTxt"></span>
						</div>

						<button type="submit" class="a-btn" id="btnForgot">
							<i class="bi bi-shield-check"></i><span>본인 확인</span>
						</button>
					</form>
				</div>
			</div>
		</main>
	</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script>
(function () {
  'use strict';

  /* ---- 유틸 ---- */
  function fe(id, msg) {
    var el = document.getElementById(id);
    el.querySelector('span').textContent = msg || '';
    el.classList.toggle('on', !!msg);
  }
  function fi(id, hasErr) { document.getElementById(id).classList.toggle('er', !!hasErr); }
  function alert_(alertId, txtId, msg) {
    document.getElementById(txtId).textContent = msg || '';
    document.getElementById(alertId).classList.toggle('on', !!msg);
  }
  function loading(btn, on, icon, label) {
    btn.disabled = on;
    btn.innerHTML = on
      ? '<span class="spinner-border spinner-border-sm" style="width:16px;height:16px"></span><span>확인 중…</span>'
      : '<i class="' + icon + '"></i><span>' + label + '</span>';
  }

  /* ---- 섹션 전환 ---- */
  document.getElementById('toForgot').addEventListener('click', function () {
    document.getElementById('secLogin').classList.remove('on');
    document.getElementById('secForgot').classList.add('on');
    document.getElementById('empNo').focus();
  });
  document.getElementById('backToLogin').addEventListener('click', function () {
    document.getElementById('secForgot').classList.remove('on');
    document.getElementById('secLogin').classList.add('on');
    document.getElementById('empEmail').focus();
  });

  /* ---- 비밀번호 표시/숨기기 ---- */
  document.getElementById('togglePw').addEventListener('click', function () {
    let inp = document.getElementById('iPw');
    let show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    this.className = (show ? 'bi bi-eye-slash' : 'bi bi-eye') + ' f-icon clickable';
  });

  /* ---- 비밀번호 찾기 폼 ---- */
  document.getElementById('fmForgot').addEventListener('submit', function (e) {
    e.preventDefault();
    let no     = document.getElementById('empNo').value.trim();
    let email  = document.getElementById('empEmail').value.trim();
    let mobile = document.getElementById('empMobile').value.trim();

    alert_('alertForgot', 'alertForgotTxt', '');
    if (!no || !email || !mobile) {
      alert_('alertForgot', 'alertForgotTxt', '모든 항목을 빠짐없이 입력해 주세요.');
      return;
    }

    let btn = document.getElementById('btnForgot');
    loading(btn, true);
    
    var csrfToken  = document.querySelector('meta[name="_csrf"]').content;
    var csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;
    
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    headers[csrfHeader] = csrfToken;

    fetch('${pageContext.request.contextPath}/auth/confirm', {
      method: 'POST',
      headers: headers,
      body: new URLSearchParams({ empNo: no, empEmail: email, empMobile: mobile })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.state != "OK") {
          loading(btn, false, 'bi bi-shield-check', '본인 확인');
          alert_('alertForgot', 'alertForgotTxt', '입력하신 정보와 일치하는 계정을 찾을 수 없습니다. 다시 확인해 주세요.');
          return;
        }
        location.href = '${pageContext.request.contextPath}/auth/forgotResetPass';
      })
      .catch(function () {
        loading(btn, false, 'bi bi-shield-check', '본인 확인');
        alert_('alertForgot', 'alertForgotTxt', '서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      });
  });

  /* ---- 휴대폰 자동 하이픈 ---- */
  document.getElementById('empMobile').addEventListener('input', function () {
	let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 7)      v = v.slice(0,3) + '-' + v.slice(3,7) + '-' + v.slice(7);
    else if (v.length > 3) v = v.slice(0,3) + '-' + v.slice(3);
    this.value = v;
  });

})();
</script>
</body>
</html>